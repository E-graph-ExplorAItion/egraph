import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/initdb";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Get mailbox email address
    const mailbox = db.prepare('SELECT email_address FROM mailboxes WHERE id = ?').get(id) as { email_address: string } | undefined;

    if (!mailbox) {
      return NextResponse.json(
        { success: false, error: `Mailbox not found for ID: ${id}` },
        { status: 404 }
      );
    }

    const email = mailbox.email_address;

    // 2. Fetch all messages from the emails table (no filtering as requested)
    const messages = db.prepare(`
      SELECT * FROM emails 
      ORDER BY sent_at DESC
    `).all();

    return NextResponse.json({
      success: true,
      email,
      messages
    });
  } catch (error: any) {
    console.error("Error fetching mailbox messages:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
