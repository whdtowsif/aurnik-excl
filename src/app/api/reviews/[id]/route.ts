import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const review = await db.review.findUnique({
      where: { id },
      include: {
        product: {
          select: { name: true },
        },
      },
    });

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    return NextResponse.json(review);
  } catch (error) {
    console.error("Failed to fetch review:", error);
    return NextResponse.json(
      { error: "Failed to fetch review" },
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
    const { isPinned, isApproved } = body;

    const updateData: {
      isPinned?: boolean;
      isApproved?: boolean;
      updatedAt: Date;
    } = { updatedAt: new Date() };

    if (isPinned !== undefined) updateData.isPinned = isPinned;
    if (isApproved !== undefined) updateData.isApproved = isApproved;

    const review = await db.review.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error("Failed to update review:", error);
    return NextResponse.json(
      { error: "Failed to update review" },
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
    
    await db.review.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete review:", error);
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 }
    );
  }
}
