import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withUserAndRLS } from "@/utils/eternal/userAndRls";

export async function GET() {
  const user = await withUserAndRLS();
  if (user instanceof NextResponse) return user;
  if (!user) return NextResponse.json({ books: [] });

  const books = await prisma.book.findMany({
    where: { userId: user.id },
    include: {
      clippings: true,
    },
  });

  return NextResponse.json({ books });
}
