import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const postSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  excerpt: z.string().max(300).optional(),
  content: z.string().min(1),
  tags: z.array(z.string()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const body = await request.json();
    const data = postSchema.parse(body);

    const existingPost = await prisma.post.findUnique({
      where: { slug: data.slug },
    });

    if (existingPost) {
      return NextResponse.json({ error: "该 slug 已存在" }, { status: 400 });
    }

    const post = await prisma.post.create({
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        tags: JSON.stringify(data.tags || []),
        authorId: session.user.id as string,
        published: true,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true, isPrivate: false },
      orderBy: { createdAt: "desc" },
      include: { author: { select: { name: true } } },
    });

    return NextResponse.json(posts);
  } catch {
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
