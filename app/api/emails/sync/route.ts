// app/api/emails/sync/route.ts
import { NextRequest, NextResponse } from "next/server";
import Imap from "imap";
import { simpleParser } from "mailparser";
import db from "@/lib/initdb";
import { randomUUID } from "crypto";
import { decrypt } from "@/lib/crypto";

export async function POST(request: NextRequest) {
  try {
    // Get all active mailboxes from database
    const mailboxes = db
      .prepare("SELECT * FROM mailboxes WHERE is_active = 1")
      .all() as any[];

    if (mailboxes.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No active mailboxes found. Please connect a mailbox first.",
        },
        { status: 404 },
      );
    }

    console.log(`📬 Syncing ${mailboxes.length} mailbox(es)...`);

    // Sync all mailboxes
    const results = await Promise.all(
      mailboxes.map((mailbox) => syncMailbox(mailbox)),
    );

    // Count successes and failures
    const successful = results.filter((r) => r.success).length;

    // Load updated graph data
    const graphNodes = db.prepare("SELECT * FROM graph_nodes LIMIT 100").all();
    const nodesWithEdges = graphNodes.map((node: any) => {
      const edgesFrom = db
        .prepare("SELECT * FROM graph_edges WHERE from_node = ?")
        .all(node.id);
      return { ...node, edges_from: edgesFrom };
    });

    return NextResponse.json({
      success: true,
      message: `Synced ${successful}/${mailboxes.length} mailbox(es)`,
      results: results,
      graphData: nodesWithEdges,
    });
  } catch (error: any) {
    console.error("Sync error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Sync failed" },
      { status: 500 },
    );
  }
}

async function syncMailbox(mailbox: any): Promise<any> {
  return new Promise((resolve) => {
    const imap = new Imap({
      user: mailbox.email_address,
      password: decrypt(mailbox.imap_password),
      host: mailbox.imap_host,
      port: parseInt(mailbox.imap_port),
      tls: mailbox.use_tls === 1,
      tlsOptions: { rejectUnauthorized: false },
      connTimeout: 60000,
      authTimeout: 60000,
      // @ts-ignore - node-imap supports socketTimeout
      socketTimeout: 60000,
      keepalive: true,
    });

    const emails: any[] = [];
    const processingPromises: Promise<void>[] = [];

    imap.once("ready", () => {
      imap.openBox("INBOX", true, (err: any, box: any) => {
        if (err) {
          console.error(
            `❌ Failed to open inbox for ${mailbox.email_address}:`,
            err,
          );
          imap.end();
          resolve({
            success: false,
            email: mailbox.email_address,
            error: err.message,
          });
          return;
        }

        const totalMessages = box.messages.total;
        console.log(`📦 ${mailbox.email_address}: Total messages in INBOX = ${totalMessages}`);
        
        if (totalMessages === 0) {
          console.log(`📭 No messages in ${mailbox.email_address}`);
          imap.end();
          resolve({
            success: true,
            email: mailbox.email_address,
            count: 0,
            message: "No emails in inbox",
          });
          return;
        }

        // Fetch last 50 emails (adjust as needed)
        const fetchRange =
          totalMessages > 50 ? `${totalMessages - 49}:${totalMessages}` : "1:*";
        console.log(`📡 ${mailbox.email_address}: Fetching range ${fetchRange}`);

        const fetch = imap.seq.fetch(fetchRange, {
          bodies: "",
          struct: true,
        });

        fetch.on("message", (msg: any, seqno: number) => {
          const emailPromise = new Promise<void>((resolveEmail, rejectEmail) => {
            let buffer = "";
            
            msg.on("body", (stream: any) => {
            stream.on("data", (chunk: any) => {
              buffer += chunk.toString("utf8");
            });
          });

            msg.once("end", async () => {
              try {
                const parsed = await simpleParser(buffer);
                
                const fromText = Array.isArray(parsed.from) 
                  ? parsed.from[0]?.text 
                  : (parsed.from as any)?.text || "";
                  
                const toText = Array.isArray(parsed.to)
                  ? parsed.to[0]?.text
                  : (parsed.to as any)?.text || "";
  
                emails.push({
                  messageId:
                    parsed.messageId || `generated-${seqno}-${Date.now()}`,
                  subject: parsed.subject || "(No Subject)",
                  from: fromText || "(Unknown Sender)",
                  to: toText || "(Unknown Recipient)",
                  date: parsed.date?.toISOString() || new Date().toISOString(),
                  body:
                    (typeof parsed.text === 'string' ? parsed.text.substring(0, 5000) : '') ||
                    (typeof parsed.html === 'string' ? parsed.html.substring(0, 5000) : '') ||
                    "",
                  inReplyTo: parsed.inReplyTo || null,
                });
                resolveEmail();
              } catch (parseError: any) {
                console.error(`Error parsing email ${seqno}:`, parseError);
                resolveEmail(); // Resolve even on error to avoid hanging
              }
            });
          });
          
          processingPromises.push(emailPromise);
        });

        fetch.once("error", (err: any) => {
          console.error(`Fetch error for ${mailbox.email_address}:`, err);
          imap.end();
          resolve({
            success: false,
            email: mailbox.email_address,
            error: err.message,
          });
        });

        fetch.once("end", async () => {
          // Wait for all email parsing to complete
          await Promise.all(processingPromises);

          console.log(
            `✅ Fetched ${emails.length} emails from ${mailbox.email_address}`,
          );
          imap.end();

          // Save to database
          try {
            saveEmailsToDatabase(emails, mailbox.email_address, mailbox.id);

            // Update last_synced_at
            db.prepare(
              "UPDATE mailboxes SET last_synced_at = ? WHERE email_address = ?",
            ).run(new Date().toISOString(), mailbox.email_address);

            resolve({
              success: true,
              email: mailbox.email_address,
              count: emails.length,
            });
          } catch (saveError: any) {
            console.error(
              `Error saving emails for ${mailbox.email_address}:`,
              saveError,
            );
            resolve({
              success: false,
              email: mailbox.email_address,
              error: saveError.message,
            });
          }
        });
      });
    });

    imap.once("error", (err: any) => {
      console.error(`IMAP error for ${mailbox.email_address}:`, err);
      resolve({
        success: false,
        email: mailbox.email_address,
        error: err.message,
      });
    });

    imap.connect();
  });
}

function saveEmailsToDatabase(emails: any[], mailboxEmail: string, mailboxId: string) {
  const transaction = db.transaction(() => {
    const threadMap = new Map<string, any[]>();

    emails.forEach((email) => {
      const threadKey =
        email.subject.replace(/^(Re:|Fwd:)\s*/i, "").trim() || "(No Subject)";
      if (!threadMap.has(threadKey)) {
        threadMap.set(threadKey, []);
      }
      threadMap.get(threadKey)!.push(email);
    });

    for (const [subject, threadEmails] of threadMap.entries()) {
      threadEmails.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );

      const firstEmail = threadEmails[0];
      const externalThreadId = firstEmail.messageId;

      let conversationId: string;
      const existingConv = db
        .prepare("SELECT id FROM conversations WHERE external_thread_id = ?")
        .get(externalThreadId) as { id: string } | undefined;

      if (existingConv) {
        conversationId = existingConv.id;
        db.prepare("UPDATE conversations SET updated_at = ? WHERE id = ?").run(
          new Date().toISOString(),
          conversationId,
        );
      } else {
        conversationId = randomUUID();
        db.prepare(
          "INSERT INTO conversations (id, subject, external_thread_id) VALUES (?, ?, ?)",
        ).run(conversationId, subject, externalThreadId);
      }

      for (const emailData of threadEmails) {
        const senderEmail =
          emailData.from.match(/<(.+?)>/)?.[1] || emailData.from;
        const rawSenderName =
          emailData.from.split("<")[0].trim() || emailData.from;
        const senderName = (rawSenderName.toLowerCase() === 'you' || rawSenderName.toLowerCase() === 'me' || !rawSenderName) 
          ? senderEmail 
          : rawSenderName;

        const recipientEmail =
          emailData.to.match(/<(.+?)>/)?.[1] || emailData.to;
        const rawRecipientName =
          emailData.to.split("<")[0].trim() || emailData.to;
        const recipientName = (rawRecipientName.toLowerCase() === 'you' || rawRecipientName.toLowerCase() === 'me' || !rawRecipientName)
          ? recipientEmail
          : rawRecipientName;
        const isOutbound =
          senderEmail.toLowerCase() === mailboxEmail.toLowerCase();
        // Skip duplicates
        const existing = db
          .prepare(
            "SELECT id FROM emails WHERE conversation_id = ? AND sender_email = ? AND sent_at = ?",
          )
          .get(conversationId, senderEmail, emailData.date);

        if (!existing) {
          const emailId = randomUUID();
          db.prepare(
            `
            INSERT INTO emails (id, conversation_id, sender_email, sender_name, recipient_email, recipient_name, direction, subject, body, sent_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
          ).run(
            emailId,
            conversationId,
            senderEmail,
            senderName,
            recipientEmail,
            recipientName,
            isOutbound ? "outbound" : "inbound",
            emailData.subject,
            emailData.body,
            emailData.date,
          );
        }

        // Always ensure graph nodes/edges exist, even for existing emails
        // This handles cases where graph data was wiped but emails remained
        createGraphNodes(
          conversationId,
          emailData,
          senderEmail,
          isOutbound,
          mailboxEmail,
          mailboxId
        );
      }
    }
  });

  transaction();
}

function createGraphNodes(
  conversationId: string,
  emailData: any,
  senderEmail: string,
  isOutbound: boolean,
  mailboxEmail: string,
  mailboxId: string,
) {
  const recipientEmail = emailData.to.match(/<(.+?)>/)?.[1] || emailData.to;
  const recipientName = emailData.to.split("<")[0].trim() || emailData.to;

  const salesNodeId = `sales-${mailboxEmail}`;
  db.prepare(
    `
    INSERT INTO graph_nodes (id, conversation_id, node_type, label, metadata)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      label = EXCLUDED.label,
      metadata = EXCLUDED.metadata
  `,
  ).run(
    salesNodeId,
    conversationId,
    "sales",
    mailboxEmail,
    JSON.stringify({ email: mailboxEmail, mailboxId }),
  );

  const clientEmail = isOutbound ? recipientEmail : senderEmail;
  const rawClientName = isOutbound
    ? recipientName
    : emailData.from.split("<")[0].trim();
  const clientName = (rawClientName.toLowerCase() === 'you' || rawClientName.toLowerCase() === 'me' || !rawClientName)
    ? clientEmail
    : rawClientName;

  const clientNodeId = `client-${mailboxId}-${clientEmail}`;

  db.prepare(
    `
    INSERT INTO graph_nodes (id, conversation_id, node_type, label, metadata)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      label = EXCLUDED.label,
      metadata = EXCLUDED.metadata
  `,
  ).run(
    clientNodeId,
    conversationId,
    "client",
    clientName || clientEmail,
    JSON.stringify({ email: clientEmail }),
  );

  const edgeId = randomUUID();
  const fromNode = isOutbound ? salesNodeId : clientNodeId;
  const toNode = isOutbound ? clientNodeId : salesNodeId;

  db.prepare(
    `
    INSERT OR IGNORE INTO graph_edges (id, from_node, to_node, label)
    VALUES (?, ?, ?, ?)
  `,
  ).run(edgeId, fromNode, toNode, emailData.subject);
}
