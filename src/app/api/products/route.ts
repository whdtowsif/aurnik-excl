import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const products = await db.product.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        reviews: {
          where: { isApproved: true },
          orderBy: { isPinned: "desc" },
        },
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST - Create new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const product = await db.product.create({
      data: {
        name: body.name,
        basePrice: parseFloat(body.basePrice) || 0,
        costPrice: parseFloat(body.costPrice) || 0,
        description: body.description || "",
        category: body.category || "Clothing",
        isLimited: body.isLimited || false,
        totalAllocation: parseInt(body.totalAllocation) || 0,
        remainingStock: parseInt(body.remainingStock) || parseInt(body.totalAllocation) || 0,
        arEnabled: body.arEnabled || false,
        featured: body.featured || false,
        imageUrl: body.imageUrl,
        arModelUrl: body.arModelUrl,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Failed to create product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
