import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/initdb";
import { encrypt, decrypt } from "@/lib/crypto";
import Imap from "imap";
import dns from "dns";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { email_address, imap_host, imap_port, imap_password, use_tls } = body;

    // 1. Get existing mailbox to retrieve current password if not provided
    const existingMailbox = db.prepare('SELECT * FROM mailboxes WHERE id = ?').get(id) as any;
    if (!existingMailbox) {
      return NextResponse.json({ success: false, error: "Mailbox not found" }, { status: 404 });
    }

    const passwordToUse = imap_password || decrypt(existingMailbox.imap_password);

    // 2. Validate IMAP connection
    // Resolve host to IPv4 to avoid Node.js IPv6 ETIMEDOUT issues (similar to fetch route)
    let resolvedHost = imap_host;
    try {
      const addresses = await dns.promises.resolve4(imap_host);
      if (addresses && addresses.length > 0) {
        resolvedHost = addresses[0];
      }
    } catch (dnsErr) {
      // console.warn(`DNS resolution failed for ${imap_host}, using original host.`, dnsErr);
    }

    try {
        await new Promise<void>((resolve, reject) => {
        const imap = new Imap({
            user: email_address,
            password: passwordToUse,
            host: resolvedHost,
            port: parseInt(imap_port),
            tls: use_tls,
            tlsOptions: { rejectUnauthorized: false, servername: imap_host },
            connTimeout: 10000, // Shorter timeout for validation
            authTimeout: 10000,
        });

        imap.once('ready', () => {
            imap.end();
            resolve();
        });

        imap.once('error', (err: any) => {
            reject(err);
        });

        imap.connect();
        });
    } catch (imapError: any) {
        return NextResponse.json({ 
            success: false, 
            error: `IMAP Connection Failed: ${imapError.message || "Unknown error"}` 
        }, { status: 400 });
    }

    const stmt = db.prepare(`
      UPDATE mailboxes 
      SET email_address = ?, 
          imap_host = ?, 
          imap_port = ?, 
          imap_password = COALESCE(?, imap_password),
          use_tls = ?
      WHERE id = ?
    `);

    stmt.run(
      email_address,
      imap_host,
      imap_port.toString(),
      imap_password ? encrypt(imap_password) : null,
      use_tls ? 1 : 0,
      id
    );

    return NextResponse.json({
      success: true,
      message: "Mailbox updated successfully"
    });
  } catch (error: any) {
    console.error("Error updating mailbox:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get mailbox details to find related nodes
    const mailbox = db.prepare('SELECT email_address FROM mailboxes WHERE id = ?').get(id) as { email_address: string } | undefined;

    if (mailbox) {
        const email = mailbox.email_address;
        const salesNodeId = `sales-${email}`;
        
        // Cascade delete: 
        // 1. Edges connected to sales node (handled by ON DELETE CASCADE in schema? 
        //    Actually schema only cascades if nodes are deleted, so we must delete nodes.)
        
        // 2. Client nodes associated with this mailbox
        //    Logic: DELETE FROM graph_nodes WHERE id LIKE 'client-{id}-%'
        
        const deleteTransaction = db.transaction(() => {
             // Delete specific client nodes for this mailbox
             db.prepare("DELETE FROM graph_nodes WHERE id LIKE ?").run(`client-${id}-%`);
             
             // Delete the sales node itself
             db.prepare("DELETE FROM graph_nodes WHERE id = ?").run(salesNodeId);

             // Delete stored emails for this mailbox (sender OR recipient is this email? 
             // Actually structure links emails to conversations, not directly mailbox id except via content.
             // But we do track mailboxId in metadata. 
             // For now, let's keep emails or basic cleanup? 
             // Request says "graph edges and nodes also deleted". 
             // The schema constraints ON DELETE CASCADE for edges -> nodes handles edge deletion automatically 
             // when we delete the nodes above.
             
             // Finally delete the mailbox
             db.prepare("DELETE FROM mailboxes WHERE id = ?").run(id);
        });

        deleteTransaction();
    } else {
         // Mailbox not found, maybe already deleted, try deleting by ID anyway
         db.prepare("DELETE FROM mailboxes WHERE id = ?").run(id);
    }

    return NextResponse.json({
      success: true,
      message: "Mailbox and related graph data deleted successfully"
    });
  } catch (error: any) {
    console.error("Error deleting mailbox:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
