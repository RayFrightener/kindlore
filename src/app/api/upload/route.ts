import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withUserAndRLS } from "@/utils/eternal/userAndRls";

export async function POST(req: Request) {
  try {
    // 1. Get user and set RLS
    const user = await withUserAndRLS();
    if (!user || user instanceof NextResponse) return user;

    // 2. Parse encrypted JSON
    const { books } = await req.json();

    // 3. Insert books and clippings
    for (const book of books) {
      const dbBook = await prisma.book.upsert({
        where: {
          userId_title: { userId: user.id, title: book.title.cipherText },
        },
        update: { author: book.author.cipherText },
        create: {
          userId: user.id,
          title: book.title.cipherText,
          author: book.author.cipherText,
          titleIv: book.title.iv,
          authorIv: book.author.iv,
        },
      });

      for (const clip of book.clippings) {
        const exists = await prisma.clipping.findFirst({
          where: {
            userId: user.id,
            bookId: dbBook.id,
            highlight: clip.clipping.cipherText,
            addedAt: new Date(clip.addedAt),
          },
        });

        if (!exists) {
          // console.log("Storing:", clip.clipping.cipherText, clip.clipping.iv);
          await prisma.clipping.create({
            data: {
              userId: user.id,
              bookId: dbBook.id,
              highlight: clip.clipping.cipherText,
              iv: clip.clipping.iv,
              addedAt: new Date(clip.addedAt),
            },
          });
        }
      }
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Upload error:", err);
    const message =
      err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
