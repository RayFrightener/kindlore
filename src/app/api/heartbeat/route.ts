import { NextResponse } from "next/server";
import { getCurrentUser } from "@/utils/eternal/getCurrentUser";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get today's date at midnight UTC
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

    // Upsert: create if doesn't exist, update if it does (though update is empty, just ensures uniqueness)
    await prisma.userDailyActivity.upsert({
      where: {
        userId_activityDate: {
          userId: user.id,
          activityDate: today,
        },
      },
      update: {}, // No update needed, just tracking existence
      create: {
        userId: user.id,
        activityDate: today,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Heartbeat error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint for checking if today's heartbeat exists
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const activity = await prisma.userDailyActivity.findUnique({
      where: {
        userId_activityDate: {
          userId: user.id,
          activityDate: today,
        },
      },
    });

    return NextResponse.json({ hasHeartbeat: !!activity });
  } catch (error) {
    console.error("Heartbeat check error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
