import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Aurnik Progress Engine - TypeScript port
// Uses Sigmoid-based curve with "Artisan Jitter" for realistic progress

interface ProgressStage {
  threshold: number;
  name: string;
}

const STAGES: ProgressStage[] = [
  { threshold: 0.15, name: "Pattern Drafting & Sourcing" },
  { threshold: 0.30, name: "Precision Fabric Cutting" },
  { threshold: 0.75, name: "Artisanal Hand-Stitching & Embroidery" },
  { threshold: 0.90, name: "Detailing & Quality Assurance" },
  { threshold: 1.00, name: "Luxury Packaging & Dispatch" },
];

function sigmoidProgress(x: number): number {
  // Sigmoid function: 1 / (1 + exp(-6 * (x - 0.5)))
  // This creates an S-curve that stays longer in the middle (handwork phase)
  return 1 / (1 + Math.exp(-6 * (x - 0.5)));
}

function addJitter(value: number, maxJitter: number = 0.02): number {
  // Add small randomness to feel human
  const jitter = (Math.random() - 0.5) * 2 * maxJitter;
  return Math.max(0, Math.min(0.99, value + jitter));
}

function getStageName(progress: number): string {
  for (const stage of STAGES) {
    if (progress <= stage.threshold) {
      return stage.name;
    }
  }
  return STAGES[STAGES.length - 1].name;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Fetch order from database
    const order = await db.order.findUnique({
      where: { orderId },
      include: {
        product: {
          select: { name: true },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Check for manual pause (Admin Control)
    if (order.isPaused) {
      return NextResponse.json({
        orderId: order.orderId,
        percent: null,
        stage: "Quality Review in Progress",
        note: "Our head artisan is performing a manual inspection.",
        isPaused: true,
        productName: order.product.name,
        artisanNotes: order.artisanNotes,
      });
    }

    // Calculate time logic
    const startDate = order.startDate;
    const targetDate = order.targetDate;

    if (!startDate || !targetDate) {
      return NextResponse.json({
        orderId: order.orderId,
        percent: 0,
        stage: STAGES[0].name,
        isPaused: false,
        productName: order.product.name,
        artisanNotes: order.artisanNotes,
      });
    }

    const currentDate = new Date();
    const totalDuration = targetDate.getTime() - startDate.getTime();
    const elapsed = currentDate.getTime() - startDate.getTime();

    // Normalized time (0 to 1)
    const x = Math.max(0, Math.min(1, elapsed / totalDuration));

    // Apply Sigmoid curve (The "Handmade" S-Curve)
    const progressRaw = sigmoidProgress(x);

    // Add jitter for human feel
    const progressFinal = addJitter(progressRaw);

    // Calculate percentage
    const percent = Math.round(progressFinal * 1000) / 10;

    // Get stage name
    const stage = getStageName(progressFinal);

    return NextResponse.json({
      orderId: order.orderId,
      percent,
      stage,
      isPaused: false,
      productName: order.product.name,
      artisanNotes: order.artisanNotes,
    });
  } catch (error) {
    console.error("Progress calculation error:", error);
    return NextResponse.json(
      { error: "Failed to calculate progress" },
      { status: 500 }
    );
  }
}
