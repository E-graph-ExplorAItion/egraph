import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/initdb";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id_sales: string }> },
) {
  try {
    const { id_sales } = await params;

    // 1. Get mailbox info
    const mailbox = db.prepare('SELECT email_address FROM mailboxes WHERE id = ?').get(id_sales) as { email_address: string } | undefined;

    if (!mailbox) {
      return NextResponse.json({ error: "Mailbox not found" }, { status: 404 });
    }

    const email = mailbox.email_address;
    const salesNodeId = `sales-${email}`;

    // 2. Find associated clients
    // We look for nodes of type 'client' that have edges connecting to our sales node
    const clients = db.prepare(`
      SELECT DISTINCT gn.id, gn.label as name, gn.metadata, gn.conversation_id
      FROM graph_nodes gn
      JOIN graph_edges ge ON (gn.id = ge.from_node OR gn.id = ge.to_node)
      WHERE gn.node_type = 'client'
      AND (ge.from_node = ? OR ge.to_node = ?)
    `).all(salesNodeId, salesNodeId) as any[];

    const salesData = {
      id: id_sales,
      name: email,
      clients: clients.map(c => {
        // Fetch messages for this client's conversation
        const messages = db.prepare(`
          SELECT id, sender_name, sender_email, recipient_name, recipient_email, subject, body, sent_at, direction
          FROM emails
          WHERE conversation_id = ?
          ORDER BY sent_at ASC
        `).all(c.conversation_id);

        return {
          id: c.id,
          name: c.name || JSON.parse(c.metadata || '{}').email || "Unknown Client",
          conversationId: c.conversation_id,
          messages: messages
        };
      }),
    };

    return NextResponse.json(salesData);
  } catch (error: any) {
    console.error("Error fetching sales data:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
