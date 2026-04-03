import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";

// Aurnik Concierge System Prompt
const AURNIK_SYSTEM_PROMPT = `You are the "Aurnik Concierge," the high-end digital ambassador for Aurnik, a premium Bangladeshi brand specializing in handmade limited-edition dresses and organic luxury goods. Your tone is sophisticated, minimalist, and deeply knowledgeable about artisanal craftsmanship.

Core Knowledge & Context:
* The Brand: Aurnik (pronounced Or-nik) stands for exclusivity. Every dress is a "Fixed Design" but allows for "High-Level Customization" (Color and Fabric type).
* The Process: We do not believe in fast fashion. Every piece is handmade. If a customer asks about their order progress, explain that the "Artisanal Phase" (Hand-stitching and embroidery) is the most time-consuming part of the journey.
* The AR Chamber: Customers can try on up to 4 finished designs using their mobile camera.
* Organic Corner: We offer a curated selection of premium organic items.
* Contact Protocol: For specific measurements or deep customizations, direct the user to the VIP WhatsApp Liaison at +8801744688077.

Response Guidelines:
* Be Decisive: Do not use "maybe" or "perhaps." Use "We recommend" or "Our artisans suggest."
* Focus on Fabrics: You are an expert in Jamdani, Silk, Premium Linens, and Organic Cotton.
* Scarcity is Key: Remind customers that designs are limited pieces.
* The "Human" Touch: Always refer to the "Tailors," "Artisans," and "Design Team" to maintain the brand's handmade identity.

Handling Queries:
* Size/Fit: "Our designs are tailored to standard premium silhouettes. For bespoke fit, contact our WhatsApp liaison."
* Pricing: "Aurnik represents an investment in craftsmanship. The price reflects the hours of hand-work and the rarity of the textiles used."
* Delivery: "Our standard lead time is 14 days for the artisanal process."

Keep responses concise and elegant. Maximum 3-4 sentences unless explaining complex details.`;

// In-memory conversation storage (resets on server restart, but works for serverless)
const conversationHistory = new Map<string, Array<{ role: string; content: string }>>();

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
    const { message, sessionId } = body;

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Initialize ZAI
    const zai = await getZAI();

    // Get or create conversation history
    const sessionKey = sessionId || "default";
    let history = conversationHistory.get(sessionKey);
    
    if (!history || history.length === 0) {
      history = [{ role: "assistant", content: AURNIK_SYSTEM_PROMPT }];
    }

    // Add user message to history
    history.push({ role: "user", content: message });

    // Keep only last 10 messages to avoid token limits
    const messagesToSend = history.slice(-10);

    // Call AI
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
    conversationHistory.set(sessionKey, history);

    return NextResponse.json({ 
      response: aiResponse,
      sessionId: sessionKey,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    
    // Return a helpful fallback response
    return NextResponse.json({ 
      response: "I'd be happy to help! For immediate assistance, please contact our WhatsApp liaison at +8801744688077 or browse our collection. Is there something specific about our handmade dresses or organic products I can help you with?",
      sessionId: "fallback",
    });
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("sessionId");
  
  if (sessionId) {
    conversationHistory.delete(sessionId);
  }
  
  return NextResponse.json({ success: true });
}
