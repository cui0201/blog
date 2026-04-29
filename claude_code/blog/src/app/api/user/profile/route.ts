import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, bio: true },
  });

  return NextResponse.json(user);
}

export async function PUT(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const body = await request.json();
  const { name, bio } = body;

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name,
      bio: bio || null,
    },
    select: { name: true, bio: true },
  });

  return NextResponse.json(user);
}
