"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

interface PostInput {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  tags?: string[];
  isPrivate?: boolean;
}

export async function upsertPost(id: string | null, data: PostInput) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "请先登录" };
  }

  if (!data.title.trim()) {
    return { error: "标题不能为空" };
  }

  if (!data.content.trim()) {
    return { error: "内容不能为空" };
  }

  const slug = data.slug?.trim() || generateSlug(data.title);

  try {
    if (id) {
      const existing = await prisma.post.findUnique({ where: { id } });
      if (!existing) {
        return { error: "文章不存在" };
      }
      if (existing.authorId !== session.user.id) {
        return { error: "无权限修改此文章" };
      }

      await prisma.post.update({
        where: { id },
        data: {
          title: data.title.trim(),
          slug,
          content: data.content.trim(),
          excerpt: data.excerpt?.trim() || null,
          tags: JSON.stringify(data.tags || []),
          isPrivate: data.isPrivate || false,
        },
      });

      revalidatePath(`/posts/${slug}`);
      revalidatePath("/");
      revalidatePath(`/user/${session.user.id}`);
      return { success: true, slug };
    } else {
      const existingSlug = await prisma.post.findUnique({ where: { slug } });
      if (existingSlug) {
        return { error: "该 slug 已被使用，请更换" };
      }

      const post = await prisma.post.create({
        data: {
          title: data.title.trim(),
          slug,
          content: data.content.trim(),
          excerpt: data.excerpt?.trim() || null,
          tags: JSON.stringify(data.tags || []),
          isPrivate: data.isPrivate || false,
          authorId: session.user.id,
        },
      });

      revalidatePath("/");
      revalidatePath(`/user/${session.user.id}`);
      return { success: true, slug: post.slug, id: post.id };
    }
  } catch (error) {
    console.error("Failed to upsert post:", error);
    return { error: "保存失败" };
  }
}

export async function deletePost(id: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "请先登录" };
  }

  try {
    const post = await prisma.post.findUnique({ where: { id } });

    if (!post) {
      return { error: "文章不存在" };
    }

    if (post.authorId !== session.user.id) {
      return { error: "无权限删除此文章" };
    }

    await prisma.post.delete({ where: { id } });

    revalidatePath("/");
    revalidatePath(`/user/${session.user.id}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to delete post:", error);
    return { error: "删除失败" };
  }
}

export async function getPostById(id: string) {
  const session = await auth();

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
        },
      },
    },
  });

  if (!post) return null;

  const isOwner = session?.user?.id === post.authorId;
  if (post.isPrivate && !isOwner) return null;

  return post;
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9一-龥]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    + "-" + Date.now().toString(36);
}
