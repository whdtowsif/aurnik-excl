import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const order = await db.order.findUnique({
      where: { orderId: id },
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
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Failed to fetch order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, isPaused, artisanNotes } = body;

    const updateData: {
      status?: string;
      isPaused?: boolean;
      artisanNotes?: string;
      updatedAt: Date;
    } = { updatedAt: new Date() };

    if (status !== undefined) updateData.status = status;
    if (isPaused !== undefined) updateData.isPaused = isPaused;
    if (artisanNotes !== undefined) updateData.artisanNotes = artisanNotes;

    const order = await db.order.update({
      where: { orderId: id },
      data: updateData,
      include: {
        product: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("Failed to update order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    await db.order.delete({
      where: { orderId: id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete order:", error);
    return NextResponse.json(
      { error: "Failed to delete order" },
      { status: 500 }
    );
  }
}
