import { NextResponse } from "next/server";
import { getCurrentUser } from "@/utils/eternal/getCurrentUser";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Get user if logged in (optional)
    const user = await getCurrentUser();

    // Validate email format if provided
    if (
      body.emailForUpdates &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.emailForUpdates)
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid email format" },
        { status: 400 }
      );
    }

    // Create feedback (userId is optional)
    const feedback = await prisma.feedback.create({
      data: {
        userId: user?.id || null,
        heardFrom: body.heardFrom || null,
        heardFromOther: body.heardFromOther || null,
        expectedToDo: body.expectedToDo || null,
        confusedOrDidntWork: body.confusedOrDidntWork || null,
        wouldUseAgain: body.wouldUseAgain || null,
        wouldUseAgainWhy: body.wouldUseAgainWhy || null,
        emailForUpdates: body.emailForUpdates || null,
      },
    });

    return NextResponse.json({ success: true, id: feedback.id });
  } catch (error) {
    console.error("Feedback submission error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit feedback" },
      { status: 500 }
    );
  }
}
