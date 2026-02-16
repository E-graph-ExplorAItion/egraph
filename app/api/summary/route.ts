import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/initdb";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { conversationId } = body;

    if (!conversationId) {
      return NextResponse.json(
        { success: false, error: "Conversation ID is required" },
        { status: 400 }
      );
    }

    // Fetch emails from conversation in SQLite
    const emails = db.prepare('SELECT * FROM emails WHERE conversation_id = ? ORDER BY sent_at ASC').all(conversationId) as any[];

    if (!emails || emails.length === 0) {
      return NextResponse.json(
        { success: false, error: "No emails found for this conversation" },
        { status: 404 }
      );
    }

    // Prepare context for AI
    const emailContext = emails
      .map((email: any, index: number) => {
        return `Email ${index + 1}:
From: ${email.sender_name || email.sender_email}
To: ${email.recipient_name || email.recipient_email}
Subject: ${email.subject}
Date: ${email.sent_at}
Body: ${email.body}
---`;
      })
      .join("\n\n");

    const prompt = `Analyze this email exchange.
${emailContext}
Provide a punchy, 2-3 sentence summary focused on the core conversations`;

    // Call OpenRouter API with a 30-second timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const openRouterResponse = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "Egraph Email Intelligence",
          },
          signal: controller.signal,
          body: JSON.stringify({
            model: "nvidia/nemotron-3-nano-30b-a3b:free",
            messages: [
              {
                role: "system",
                content: "You are a concise business analyst. Provide short, punchy summaries that get straight to the point."
              },
              {
                role: "user",
                content: prompt,
              },
            ],
          }),
        }
      );

      clearTimeout(timeoutId);

      if (!openRouterResponse.ok) {
        const errorText = await openRouterResponse.text();
        let errorJson: any = {};
        try { errorJson = JSON.parse(errorText); } catch(e) {}
        
        console.error("OpenRouter API error:", errorJson);
        return NextResponse.json(
          { 
            success: false, 
            error: errorJson.error?.message || "AI generation failed. Please check your API key or network connection." 
          },
          { status: openRouterResponse.status }
        );
      }

      const aiResponse = await openRouterResponse.json();
      const summaryText = aiResponse.choices[0]?.message?.content || "No summary generated";

      return NextResponse.json({
        success: true,
        summary: summaryText,
        cached: false,
      });
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        console.error("Summary API: OpenRouter request timed out after 30s");
        return NextResponse.json(
          { success: false, error: "AI summary timed out. OpenRouter is responding slowly, please try again." },
          { status: 504 }
        );
      }
      throw fetchError; // Re-throw to be caught by the outer catch block
    }
  } catch (error: any) {
    console.error("Summary API error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
