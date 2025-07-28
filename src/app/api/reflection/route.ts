import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withUserAndRLS } from "@/utils/eternal/userAndRls";

export async function POST(req: Request) {
  const user = await withUserAndRLS();
  if (user instanceof NextResponse) return user;
  if (!user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { clippingId, text, iv } = await req.json();
  if (!clippingId || !text || !iv)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  const reflection = await prisma.reflection.create({
    data: {
      clippingId,
      userId: user.id,
      text,
      iv,
    },
  });

  return NextResponse.json({ reflection });
}

export async function GET(req: NextRequest) {
  const user = await withUserAndRLS();
  if (user instanceof NextResponse) return user;
  if (!user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const clippingId = searchParams.get("clippingId");
  if (!clippingId)
    return NextResponse.json({ error: "Missing clippingId" }, { status: 400 });

  const reflections = await prisma.reflection.findMany({
    where: { clippingId, userId: user.id },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ reflections });
}

export async function DELETE(req: NextRequest) {
  const user = await withUserAndRLS();
  if (user instanceof NextResponse) return user;
  if (!user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const reflectionId = searchParams.get("id");
  if (!reflectionId)
    return NextResponse.json(
      { error: "Missing reflection id" },
      { status: 400 }
    );

  await prisma.reflection.delete({
    where: { id: reflectionId },
  });

  return NextResponse.json({ success: true });
}
