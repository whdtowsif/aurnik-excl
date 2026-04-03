import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    // If userId is "all", return all orders (for admin dashboard)
    const whereClause = userId && userId !== "all" ? { userId } : {};

    const orders = await db.order.findMany({
      where: whereClause,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            basePrice: true,
            imageUrl: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, productId, materialId, totalPrice } = body;

    // Generate order ID
    const orderId = `ord-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 4)}`;

    // Calculate dates (14-day production window)
    const startDate = new Date();
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 14);

    const order = await db.order.create({
      data: {
        orderId,
        userId,
        productId,
        materialId,
        totalPrice,
        status: "Pending",
        startDate,
        targetDate,
      },
      include: {
        product: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("Failed to create order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
