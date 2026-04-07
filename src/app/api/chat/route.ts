import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";

export const maxDuration = 30;

// Initialize ZAI instance once
let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null;

async function getZAI() {
  if (!zaiInstance) {
    zaiInstance = await ZAI.create();
  }
  return zaiInstance;
}

// Aurnik Concierge System Prompt
const AURNIK_SYSTEM_PROMPT = `You are the "Aurnik Concierge," the high-end digital ambassador for Aurnik, a premium Bangladeshi brand specializing in handmade limited-edition dresses and organic luxury goods.

Core Knowledge:
- Brand: Aurnik (pronounced Or-nik) - exclusivity and handmade craftsmanship
- Products: Handmade dresses with fabric/color customization, organic luxury goods
- Process: Each piece takes 120+ hours of artisanal work
- AR Try-On: Available for finished designs
- Contact: WhatsApp at +8801744688077 for custom requests

Response Guidelines:
- Be sophisticated and helpful
- Keep responses concise (2-3 sentences)
- Mention fabrics: Jamdani, Silk, Linen, Organic Cotton
- Remind about limited availability
- For sizing/custom requests, direct to WhatsApp`;

// Fallback responses for when AI is unavailable
const FALLBACK_RESPONSES: Record<string, string> = {
  default: "I'd be happy to help! Our handmade dresses take 120+ hours of artisanal craftsmanship. For specific questions about sizing, fabrics, or custom orders, please contact our WhatsApp liaison at +8801744688077. Is there something specific I can help you with?",
  fabric: "We work with premium Jamdani, Silk, Linen, and Organic Cotton. Each fabric has unique characteristics - Jamdani is our heritage weave, while our organic cottons are sustainably sourced. Would you like more details on any specific fabric?",
  delivery: "Our standard delivery is 14 days for the artisanal process. Each piece is handcrafted after your order. For urgent requests, please contact our WhatsApp at +8801744688077.",
  price: "Aurnik represents an investment in craftsmanship. Prices reflect the 120+ hours of hand-work and premium textiles. Each piece is a limited edition. Would you like to browse our collection?",
  size: "Our designs follow premium standard sizing. For bespoke fit, contact our WhatsApp liaison at +8801744688077 with your measurements, and our artisans will ensure a perfect fit.",
};

function getFallbackResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  if (lowerMessage.includes('fabric') || lowerMessage.includes('jamdani') || lowerMessage.includes('silk')) {
    return FALLBACK_RESPONSES.fabric;
  }
  if (lowerMessage.includes('delivery') || lowerMessage.includes('shipping') || lowerMessage.includes('time')) {
    return FALLBACK_RESPONSES.delivery;
  }
  if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('how much')) {
    return FALLBACK_RESPONSES.price;
  }
  if (lowerMessage.includes('size') || lowerMessage.includes('fit') || lowerMessage.includes('measurement')) {
    return FALLBACK_RESPONSES.size;
  }
  return FALLBACK_RESPONSES.default;
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

    // Try to use AI SDK
    try {
      const zai = await getZAI();

      const completion = await zai.chat.completions.create({
        messages: [
          { role: "assistant", content: AURNIK_SYSTEM_PROMPT },
          { role: "user", content: message },
        ],
        thinking: { type: "disabled" },
      });

      const aiResponse = completion.choices[0]?.message?.content;

      if (aiResponse) {
        return NextResponse.json({
          response: aiResponse,
          sessionId: sessionId || "default",
        });
      }
    } catch (aiError) {
      console.error("AI SDK error:", aiError);
    }

    // Fallback response
    return NextResponse.json({
      response: getFallbackResponse(message),
      sessionId: sessionId || "default",
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({
      response: FALLBACK_RESPONSES.default,
      sessionId: "fallback",
    });
  }
}
