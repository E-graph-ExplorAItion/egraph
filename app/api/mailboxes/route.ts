import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/initdb";

export async function GET() {
  try {
    const mailboxes = db.prepare('SELECT id, email_address, imap_host, imap_port, use_tls, is_active, last_synced_at, created_at FROM mailboxes ORDER BY created_at DESC').all();
    
    return NextResponse.json({
      success: true,
      mailboxes
    });
  } catch (error: any) {
    console.error("Error fetching mailboxes:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
