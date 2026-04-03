import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Subscribe to newsletter/membership
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, phone, source = "website" } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Check if already subscribed
    const existingSubscriber = await db.subscriber.findUnique({
      where: { email },
    });

    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return NextResponse.json({
          success: true,
          message: "You are already subscribed to Aurnik!",
          subscriber: {
            email: existingSubscriber.email,
            name: existingSubscriber.name,
            subscribedAt: existingSubscriber.subscribedAt,
          },
        });
      } else {
        // Reactivate subscriber
        const reactivated = await db.subscriber.update({
          where: { email },
          data: {
            isActive: true,
            name: name || existingSubscriber.name,
            phone: phone || existingSubscriber.phone,
            source,
            updatedAt: new Date(),
          },
        });
        return NextResponse.json({
          success: true,
          message: "Welcome back! Your subscription has been reactivated.",
          subscriber: {
            email: reactivated.email,
            name: reactivated.name,
            subscribedAt: reactivated.subscribedAt,
          },
        });
      }
    }

    // Create new subscriber
    const subscriber = await db.subscriber.create({
      data: {
        email,
        name: name || null,
        phone: phone || null,
        source,
        isVerified: false,
        isActive: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Welcome to the Aurnik family! Check your email for exclusive updates.",
      subscriber: {
        email: subscriber.email,
        name: subscriber.name,
        subscribedAt: subscriber.subscribedAt,
      },
    });
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json(
      { error: "Failed to subscribe. Please try again." },
      { status: 500 }
    );
  }
}

// Get subscriber by email
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const subscriber = await db.subscriber.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        isVerified: true,
        isActive: true,
        subscribedAt: true,
      },
    });

    if (!subscriber) {
      return NextResponse.json(
        { exists: false },
        { status: 404 }
      );
    }

    return NextResponse.json({
      exists: true,
      subscriber,
    });
  } catch (error) {
    console.error("Get subscriber error:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscriber" },
      { status: 500 }
    );
  }
}

// Unsubscribe
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    await db.subscriber.update({
      where: { email },
      data: { isActive: false, updatedAt: new Date() },
    });

    return NextResponse.json({
      success: true,
      message: "You have been unsubscribed from Aurnik updates.",
    });
  } catch (error) {
    console.error("Unsubscribe error:", error);
    return NextResponse.json(
      { error: "Failed to unsubscribe" },
      { status: 500 }
    );
  }
}
