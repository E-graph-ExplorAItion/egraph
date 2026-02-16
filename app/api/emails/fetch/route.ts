// app/api/emails/connect/route.ts
import { NextRequest, NextResponse } from "next/server";
import Imap from "imap";
import { simpleParser } from "mailparser";
import db from "@/lib/initdb";
import { randomUUID } from "crypto";
import { encrypt } from "@/lib/crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, host, port, tls } = body;

    // Validate input
    if (!email || !password || !host || !port) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Test IMAP connection first
    const imap = new Imap({
      user: email,
      password: password,
      host: host,
      port: port,
      tls: tls,
      tlsOptions: { rejectUnauthorized: false },
      connTimeout: 60000,
      authTimeout: 60000,
      socketTimeout: 60000,
    });

    return new Promise((resolve) => {
      imap.once("ready", () => {
        console.log(`✅ IMAP connection successful for ${email}`);

        // Save mailbox to database
        try {
          const stmt = db.prepare(`
            INSERT INTO mailboxes (id, email_address, imap_host, imap_port, imap_password, use_tls, is_active, last_synced_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(email_address) DO UPDATE SET
              imap_host = excluded.imap_host,
              imap_port = excluded.imap_port,
              imap_password = excluded.imap_password,
              use_tls = excluded.use_tls,
              is_active = excluded.is_active,
              last_synced_at = excluded.last_synced_at
          `);

          stmt.run(
            randomUUID(),
            email,
            host,
            port.toString(),
            encrypt(password),
            tls ? 1 : 0,
            1,
            new Date().toISOString(),
          );

          imap.end();

          resolve(
            NextResponse.json({
              success: true,
              message: "Mailbox connected successfully",
              email: email,
            }),
          );
        } catch (dbError: any) {
          console.error("Database error:", dbError);
          imap.end();
          resolve(
            NextResponse.json(
              {
                success: false,
                error: "Failed to save mailbox: " + dbError.message,
              },
              { status: 500 },
            ),
          );
        }
      });

      imap.once("error", (err: any) => {
        console.error("IMAP connection error:", err);
        resolve(
          NextResponse.json(
            { success: false, error: "IMAP connection failed: " + err.message },
            { status: 500 },
          ),
        );
      });

      imap.connect();
    });
  } catch (error: any) {
    console.error("Server error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
