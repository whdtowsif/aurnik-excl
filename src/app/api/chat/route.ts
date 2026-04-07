import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";

export const maxDuration = 60;

// Initialize ZAI instance once
let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null;

async function getZAI() {
  if (!zaiInstance) {
    zaiInstance = await ZAI.create();
  }
  return zaiInstance;
}

// Enhanced Aurnik Concierge System Prompt
const AURNIK_SYSTEM_PROMPT = `You are the Aurnik Concierge, an elegant and knowledgeable AI assistant for Aurnik - Bangladesh's premier luxury fashion brand. You represent sophistication, heritage, and exceptional craftsmanship.

## About Aurnik
- **Brand Name**: Aurnik (pronounced "Or-nik") - means "unique" in Bengali
- **Location**: Dhaka, Bangladesh
- **Founded**: 2024
- **Mission**: Preserving Bangladesh's rich textile heritage through contemporary luxury fashion

## Products & Services

### Handmade Dresses
- Each piece requires 120+ hours of artisanal handwork
- Limited edition (only 10-50 pieces per design)
- Fabrics: Jamdani (UNESCO heritage), Mulberry Silk, Organic Cotton, Belgian Linen
- Customization: Fabric selection, color, embroidery patterns, sizing
- Price Range: BDT 15,000 - 150,000+

### Organic Luxury Goods
- Organic honey, artisanal teas, natural skincare
- Sourced from sustainable farms across Bangladesh
- Premium gift sets available

## Key Information

### Ordering Process
1. Browse collection online
2. Select fabric and customization options
3. Place order with 50% deposit
4. Artisans begin handcrafting (7-14 days)
5. Quality inspection
6. Express delivery (2-3 days)

### Shipping & Delivery
- **Bangladesh**: Free delivery, 10-14 days total
- **International**: Express shipping available (additional cost)
- **Rush Orders**: Available for additional fee - contact WhatsApp

### Returns & Exchange
- Due to handcrafted nature, all sales are final
- Size adjustments available within 7 days of delivery
- Quality guarantee: Full refund for manufacturing defects

### Contact
- **WhatsApp**: +8801744688077
- **Response Time**: Within 2 hours (10AM-10PM BST)
- **Custom Orders**: Schedule virtual consultation

## Conversation Style
- Be warm, elegant, and genuinely helpful
- Use a sophisticated but accessible tone
- Show passion for Bangladeshi craftsmanship
- Be concise but thorough (2-4 sentences typically)
- Always offer to connect with human via WhatsApp for complex requests
- Mention limited availability when discussing products
- Share interesting facts about fabrics and techniques when relevant

## Special Responses
- If asked about competitors: Focus on Aurnik's unique value - heritage, limited edition, artisanal
- If asked about discounts: Mention occasional exclusives for newsletter subscribers
- If asked about wholesale: Direct to WhatsApp for B2B inquiries
- If customer seems frustrated: Apologize sincerely and offer immediate WhatsApp connection

Remember: You're not just selling clothes - you're sharing Bangladesh's rich textile heritage and creating meaningful connections with customers who value authentic craftsmanship.`;

// Conversation storage (in-memory, resets on server restart)
const conversations = new Map<string, Array<{role: string; content: string}>>();

function getConversationHistory(sessionId: string): Array<{role: string; content: string}> {
  if (!conversations.has(sessionId)) {
    conversations.set(sessionId, [
      { role: "assistant", content: AURNIK_SYSTEM_PROMPT }
    ]);
  }
  return conversations.get(sessionId)!;
}

function cleanupOldConversations() {
  // Keep only last 100 conversations to prevent memory issues
  if (conversations.size > 100) {
    const keys = Array.from(conversations.keys()).slice(0, 50);
    keys.forEach(key => conversations.delete(key));
  }
}

// Enhanced fallback responses
const FALLBACK_RESPONSES: Record<string, string> = {
  greeting: "Hello! Welcome to Aurnik. I'm here to help you discover our collection of handcrafted luxury fashion. Each piece takes over 120 hours of artisanal work. What brings you to us today?",
  
  fabric: "We work exclusively with premium natural fabrics:\n\n• **Jamdani** - UNESCO heritage weave, incredibly breathable\n• **Mulberry Silk** - Luxurious drape and natural sheen\n• **Organic Cotton** - Sustainable and ultra-soft\n• **Belgian Linen** - Perfect for our tropical climate\n\nWhich fabric interests you most?",
  
  delivery: "Our delivery timeline:\n\n• **Within Bangladesh**: 10-14 days (free delivery)\n• **International**: Express shipping available\n• **Rush Orders**: Possible for special occasions\n\nEach piece is handcrafted after your order. Need it faster? Contact our WhatsApp at +8801744688077.",
  
  price: "Our pricing reflects true artisanal craftsmanship:\n\n• Each piece: 120+ hours of handwork\n• Limited to 10-50 pieces per design\n• Premium natural fabrics only\n\nPrices range from BDT 15,000 for accessories to BDT 150,000+ for elaborate pieces. Would you like to see our current collection?",
  
  size: "We offer:\n\n• Standard sizing (XS-XXL)\n• Custom measurements at no extra charge\n• Virtual fitting consultation via WhatsApp\n\nFor the perfect fit, share your measurements with us on WhatsApp: +8801744688077",
  
  custom: "We love creating bespoke pieces! Here's how:\n\n1. Share your vision via WhatsApp\n2. Virtual consultation with our design team\n3. Fabric and detail selection\n4. 2-3 weeks for handcrafting\n\nStart your custom order: +8801744688077",
  
  returns: "Due to the handcrafted nature:\n\n• All sales are final\n• Size adjustments available within 7 days\n• Full refund for any quality issues\n\nYour satisfaction is our priority. Any concerns? Contact us immediately on WhatsApp.",
  
  default: "I'd be delighted to help! Our artisans create each Aurnik piece with over 120 hours of dedicated handwork. \n\nYou can ask me about:\n• Our fabric collections\n• Sizing and customization\n• Delivery options\n• Pricing\n\nOr connect directly with our team on WhatsApp: +8801744688077"
};

function getFallbackResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  // Greetings
  if (/^(hi|hello|hey|good\s*(morning|afternoon|evening)|assalam|salaam)/i.test(lowerMessage)) {
    return FALLBACK_RESPONSES.greeting;
  }
  
  // Fabric related
  if (lowerMessage.includes('fabric') || lowerMessage.includes('jamdani') || lowerMessage.includes('silk') || lowerMessage.includes('cotton') || lowerMessage.includes('linen') || lowerMessage.includes('material')) {
    return FALLBACK_RESPONSES.fabric;
  }
  
  // Delivery related
  if (lowerMessage.includes('delivery') || lowerMessage.includes('shipping') || lowerMessage.includes('time') || lowerMessage.includes('arrive') || lowerMessage.includes('how long') || lowerMessage.includes('days')) {
    return FALLBACK_RESPONSES.delivery;
  }
  
  // Price related
  if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('how much') || lowerMessage.includes('rate') || lowerMessage.includes('cheap') || lowerMessage.includes('expensive') || lowerMessage.includes('afford')) {
    return FALLBACK_RESPONSES.price;
  }
  
  // Size related
  if (lowerMessage.includes('size') || lowerMessage.includes('fit') || lowerMessage.includes('measurement') || lowerMessage.includes('large') || lowerMessage.includes('small') || lowerMessage.includes('xl') || lowerMessage.includes('xs')) {
    return FALLBACK_RESPONSES.size;
  }
  
  // Custom orders
  if (lowerMessage.includes('custom') || lowerMessage.includes('bespoke') || lowerMessage.includes('personalized') || lowerMessage.includes('made to order') || lowerMessage.includes('tailor')) {
    return FALLBACK_RESPONSES.custom;
  }
  
  // Returns
  if (lowerMessage.includes('return') || lowerMessage.includes('refund') || lowerMessage.includes('exchange') || lowerMessage.includes('cancel')) {
    return FALLBACK_RESPONSES.returns;
  }
  
  // Contact
  if (lowerMessage.includes('contact') || lowerMessage.includes('phone') || lowerMessage.includes('whatsapp') || lowerMessage.includes('call') || lowerMessage.includes('reach')) {
    return "You can reach our team:\n\n• **WhatsApp**: +8801744688077\n• **Hours**: 10AM - 10PM (Bangladesh Time)\n• **Response**: Within 2 hours\n\nWe'd love to hear from you!";
  }
  
  // About the brand
  if (lowerMessage.includes('about') || lowerMessage.includes('who are you') || lowerMessage.includes('brand') || lowerMessage.includes('story') || lowerMessage.includes('history')) {
    return "Aurnik means 'unique' in Bengali. We're a luxury fashion house from Dhaka, dedicated to preserving Bangladesh's rich textile heritage through contemporary design.\n\nEach piece is handcrafted by master artisans using traditional techniques passed down through generations. Our Jamdani fabrics are UNESCO-recognized heritage crafts.\n\nWe believe in slow fashion - quality over quantity, always.";
  }
  
  return FALLBACK_RESPONSES.default;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, sessionId = "default" } = body;

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    cleanupOldConversations();

    // Try to use AI SDK with conversation history
    try {
      const zai = await getZAI();
      const history = getConversationHistory(sessionId);
      
      // Add user message to history
      history.push({ role: "user", content: message });
      
      // Keep only last 10 messages to avoid token limits
      const messagesToSend = history.slice(-10);

      const completion = await zai.chat.completions.create({
        messages: messagesToSend,
        thinking: { type: "disabled" },
      });

      const aiResponse = completion.choices[0]?.message?.content;

      if (aiResponse) {
        // Add AI response to history
        history.push({ role: "assistant", content: aiResponse });
        
        return NextResponse.json({
          response: aiResponse,
          sessionId: sessionId,
        });
      }
    } catch (aiError) {
      console.error("AI SDK error:", aiError);
    }

    // Fallback response
    return NextResponse.json({
      response: getFallbackResponse(message),
      sessionId: sessionId,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({
      response: FALLBACK_RESPONSES.default,
      sessionId: "fallback",
    });
  }
}
