"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Edit, Trash2, Lock, Globe, X } from "lucide-react";
import { toast } from "sonner";
import { deletePost } from "@/app/actions/post";

interface Post {
  id: string;
  title: string;
  slug: string;
  isPrivate: boolean;
  published: boolean;
  createdAt: Date;
  _count: {
    likes: number;
    comments: number;
  };
}

interface PostManagementProps {
  posts: Post[];
  userId: string;
}

export function PostManagement({ posts, userId }: PostManagementProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const result = await deletePost(id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("删除成功");
        setDeleteId(null);
      }
    });
  };

  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground mb-4">还没有发布文章</p>
        <Link
          href={`/editor/${userId}/new`}
          className="text-primary hover:underline"
        >
          写一篇吧
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2">
        {posts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="group flex items-center justify-between p-4 rounded-lg border border-border hover:border-muted-foreground/30 hover:bg-muted/50 transition-all duration-200"
          >
            <div className="flex-1 min-w-0">
              <Link
                href={`/posts/${post.id}`}
                className="font-medium hover:text-foreground/80 transition-colors line-clamp-1"
              >
                {post.title}
              </Link>
              <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                <span>{post.createdAt.toLocaleDateString("zh-CN")}</span>
                <span className="flex items-center gap-1">
                  {post.isPrivate ? (
                    <Lock className="h-3 w-3 text-amber-600" />
                  ) : (
                    <Globe className="h-3 w-3" />
                  )}
                  {post.isPrivate ? "私密" : "公开"}
                </span>
                <span>{post._count.likes} 赞</span>
                <span>{post._count.comments} 评论</span>
              </div>
            </div>

            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Link
                href={`/editor/${userId}/${post.id}`}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                title="编辑"
              >
                <Edit className="h-4 w-4" />
              </Link>
              <button
                onClick={() => setDeleteId(post.id)}
                className="p-2 text-muted-foreground hover:text-red-500 transition-colors"
                title="删除"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={() => setDeleteId(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-background rounded-lg shadow-xl max-w-sm w-full mx-4 p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">确认删除</h3>
                <button
                  onClick={() => setDeleteId(null)}
                  className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="text-muted-foreground mb-6">
                确定要删除这篇文章吗？此操作无法撤销。
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDeleteId(null)}
                  className="px-4 py-2 text-sm font-medium border border-border rounded-md hover:bg-muted transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={() => handleDelete(deleteId)}
                  disabled={isPending}
                  className="px-4 py-2 text-sm font-medium bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {isPending ? "删除中..." : "删除"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
