import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * Gets the current user, sets app.current_user_id for RLS, and returns the user.
 * Returns a NextResponse 401 if not authenticated.
 */
export async function withUserAndRLS() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, email: true, name: true },
  });

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Set the RLS session variable for this connection
  await prisma.$executeRawUnsafe(
    `SET app.current_user_id = '${user.id}'`
  );

  return user;
}