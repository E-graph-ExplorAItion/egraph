import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/initdb";

export async function GET(request: NextRequest) {
  try {
    // Load graph data (nodes + their outgoing edges)
    const graphNodes = db.prepare('SELECT * FROM graph_nodes LIMIT 50').all() as any[];
    const nodesWithEdges = graphNodes.map(node => {
      // Parse metadata
      let metadata = node.metadata;
      if (typeof metadata === 'string') {
        try { metadata = JSON.parse(metadata); } catch(e) {}
      }
      if (!metadata) metadata = {};

      let label = node.label;

      // Repair logic for sales nodes
      if (node.node_type === 'sales') {
        // Try to find the actual mailbox to get the ID and correct email
        const emailFromId = node.id.replace('sales-', '');
        const mailbox = db.prepare('SELECT id, email_address FROM mailboxes WHERE email_address = ? OR id = ?').get(emailFromId, emailFromId) as { id: string, email_address: string } | undefined;
        
        if (mailbox) {
          metadata.mailboxId = mailbox.id;
          metadata.email = mailbox.email_address;
          // Fix "You" label
          if (label === 'You' || label === 'you' || !label) {
            label = mailbox.email_address;
          }
        }
      }

      const edgesFrom = db.prepare('SELECT * FROM graph_edges WHERE from_node = ?').all(node.id);
      return { 
        ...node, 
        label,
        metadata,
        edges_from: edgesFrom 
      };
    });

    // Get counts for stats
    const emailCount = (db.prepare('SELECT COUNT(*) as count FROM emails').get() as { count: number }).count;
    const nodeCount = graphNodes.length;
    const edgeCount = (db.prepare('SELECT COUNT(*) as count FROM graph_edges').get() as { count: number }).count;

    return NextResponse.json({
      success: true,
      graphData: nodesWithEdges,
      stats: {
        emailCount,
        nodeCount,
        connectionCount: edgeCount
      }
    });
  } catch (error: any) {
    console.error("Data query error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
