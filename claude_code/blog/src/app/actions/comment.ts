"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createComment(postId: string, content: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "请先登录" };
  }

  if (!content.trim()) {
    return { error: "评论内容不能为空" };
  }

  try {
    await prisma.comment.create({
      data: {
        content: content.trim(),
        authorId: session.user.id,
        postId,
      },
    });

    revalidatePath(`/posts/${postId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to create comment:", error);
    return { error: "评论发表失败" };
  }
}
