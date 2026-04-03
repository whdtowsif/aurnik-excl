import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET single product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await db.product.findUnique({
      where: { id },
      include: {
        reviews: {
          where: { isApproved: true },
          take: 5,
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

// PUT - Update product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const product = await db.product.update({
      where: { id },
      data: {
        name: body.name,
        basePrice: parseFloat(body.basePrice) || 0,
        costPrice: parseFloat(body.costPrice) || 0,
        description: body.description,
        category: body.category,
        isLimited: body.isLimited || false,
        totalAllocation: parseInt(body.totalAllocation) || 0,
        remainingStock: parseInt(body.remainingStock) || 0,
        arEnabled: body.arEnabled || false,
        featured: body.featured || false,
        imageUrl: body.imageUrl,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

// DELETE product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if product has orders
    const orders = await db.order.findMany({
      where: { productId: id },
      take: 1,
    });

    if (orders.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete product with existing orders" },
        { status: 400 }
      );
    }

    await db.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
