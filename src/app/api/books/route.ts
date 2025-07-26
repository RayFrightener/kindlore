import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/utils/eternal/getCurrentUser";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ books: [] });

  const books = await prisma.book.findMany({
    where: { userId: user.id },
    include: {
      clippings: true,
    },
  });

  return NextResponse.json({ books });
}