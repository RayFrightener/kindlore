import { getCurrentUser } from "@/utils/eternal/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { salt } = await req.json();
  if (!salt) return NextResponse.json({ error: "Missing salt" }, { status: 400 });

  await prisma.user.update({
    where: { id: user.id },
    data: {
      encryptionSalt: salt,
      hasSetEncryptionPassword: true,
    },
  });

  return NextResponse.json({ success: true });
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Fetch the user from DB to get encryptionSalt
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { encryptionSalt: true },
  });
    // console.log("Salt from DB:", dbUser?.encryptionSalt); // 
  return NextResponse.json({ salt: dbUser?.encryptionSalt ?? null });
}