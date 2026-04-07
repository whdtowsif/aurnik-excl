import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const maxDuration = 10;

export async function GET() {
  try {
    const materials = await db.material.findMany({
      orderBy: { qualityGrade: "asc" },
    });

    return NextResponse.json(materials);
  } catch (error) {
    console.error("Failed to fetch materials:", error);
    return NextResponse.json(
      { error: "Failed to fetch materials", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
