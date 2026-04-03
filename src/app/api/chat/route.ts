import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import ZAI from "z-ai-web-dev-sdk";

// Aurnik Concierge System Prompt
const AURNIK_SYSTEM_PROMPT = `You are the "Aurnik Concierge," the high-end digital ambassador for Aurnik, a premium Bangladeshi brand specializing in handmade limited-edition dresses and organic luxury goods. Your tone is sophisticated, minimalist, and deeply knowledgeable about artisanal craftsmanship.

Core Knowledge & Context:
* The Brand: Aurnik (pronounced Or-nik) stands for exclusivity. Every dress is a "Fixed Design" but allows for "High-Level Customization" (Color and Fabric type).
* The Process: We do not believe in fast fashion. Every piece is handmade. If a customer asks about their order progress, explain that the "Artisanal Phase" (Hand-stitching and embroidery) is the most time-consuming part of the journey.
* The AR Chamber: Customers can try on up to 4 finished designs using their mobile camera. If they ask for more, politely suggest they proceed with a "Member Registration" or an order to unlock the full vault.
* Organic Corner: We offer a curated selection of premium organic items. These are sourced with the same "No-Compromise" quality as our clothing.
* Contact Protocol: For specific measurements or deep customizations, direct the user to the VIP WhatsApp Liaison.

Response Guidelines:
* Be Decisive: Do not use "maybe" or "perhaps." Use "We recommend" or "Our artisans suggest."
* Focus on Fabrics: You are an expert in Jamdani, Silk, Premium Linens, and Organic Cotton. When asked about "Quality," describe the "Feel," "Fall," and "Breathability" of the fabric.
* Scarcity is Key: Remind customers that designs are limited pieces. Use phrases like "While the current allocation remains" or "Given the limited nature of this design."
* The "Human" Touch: Even though you are an AI, always refer to the "Tailors," "Artisans," and "Design Team" to maintain the brand's handmade identity.

Handling Queries:
* Size/Fit: "Our designs are tailored to standard premium silhouettes, but our fabric choices allow for a graceful drape. Shall I guide you to our size chart, or would you prefer a direct consultation via WhatsApp for a bespoke fit?"
* Pricing: "Aurnik represents an investment in craftsmanship. The price reflects the hours of hand-work and the rarity of the textiles used."
* Delivery: "Because each piece is prepared specifically for you, our standard lead time is 14 days. You can monitor every stitch of progress in your 'Member Vault'."

Constraint:
Never offer generic discounts. Only mention "Curated Offers" if the system flags an "AI-Approved Proposal" for that specific user.

Keep responses concise and elegant. Maximum 3-4 sentences unless explaining complex details.`;

let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null;

async function getZAI() {
  if (!zaiInstance) {
    zaiInstance = await ZAI.create();
  }
  return zaiInstance;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, sessionId, userId } = body;

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const zai = await getZAI();

    // Get or create chat session from database
    let chatSession = null;
    let history: Array<{ role: string; content: string }> = [];

    if (sessionId) {
      try {
        chatSession = await db.chatSession.findUnique({
          where: { id: sessionId },
        });
        
        if (chatSession) {
          history = JSON.parse(chatSession.messages);
        }
      } catch (error) {
        console.error("Error fetching chat session:", error);
      }
    }

    // If no history, start with system prompt
    if (history.length === 0) {
      history = [{ role: "assistant", content: AURNIK_SYSTEM_PROMPT }];
    }

    // Add user message to history
    history.push({ role: "user", content: message });

    // Keep only last 20 messages to avoid token limits
    const messagesToSend = history.slice(-20);

    const completion = await zai.chat.completions.create({
      messages: messagesToSend.map((m) => ({
        role: m.role as "assistant" | "user",
        content: m.content,
      })),
      thinking: { type: "disabled" },
    });

    const aiResponse = completion.choices[0]?.message?.content;

    if (!aiResponse) {
      return NextResponse.json(
        { error: "No response from AI" },
        { status: 500 }
      );
    }

    // Add AI response to history
    history.push({ role: "assistant", content: aiResponse });

    // Save to database
    try {
      if (chatSession) {
        // Update existing session
        await db.chatSession.update({
          where: { id: sessionId },
          data: {
            messages: JSON.stringify(history),
            updatedAt: new Date(),
          },
        });
      } else {
        // Create new session
        chatSession = await db.chatSession.create({
          data: {
            id: sessionId || undefined,
            userId: userId || null,
            messages: JSON.stringify(history),
          },
        });
      }
    } catch (dbError) {
      console.error("Error saving chat session:", dbError);
      // Continue even if save fails - return response anyway
    }

    return NextResponse.json({ 
      response: aiResponse,
      sessionId: chatSession?.id || sessionId,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("sessionId");
  
  if (sessionId) {
    try {
      await db.chatSession.delete({
        where: { id: sessionId },
      });
    } catch (error) {
      console.error("Error deleting chat session:", error);
    }
  }
  
  return NextResponse.json({ success: true });
}
