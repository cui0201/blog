"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { createComment } from "@/app/actions/comment";
import { Send } from "lucide-react";

interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  author: {
    id: string;
    name: string | null;
    avatarUrl: string | null;
  };
}

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
}

export function CommentSection({ postId, comments }: CommentSectionProps) {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();
  const [localComments, setLocalComments] = useState(comments);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      toast.error("请先登录后再评论");
      return;
    }

    if (!content.trim()) {
      toast.error("评论内容不能为空");
      return;
    }

    startTransition(async () => {
      const result = await createComment(postId, content);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("评论发表成功");
        setContent("");
        const newComment: Comment = {
          id: Date.now().toString(),
          content: content.trim(),
          createdAt: new Date(),
          author: {
            id: session.user.id,
            name: session.user.name || null,
            avatarUrl: session.user.image || null,
          },
        };
        setLocalComments((prev) => [newComment, ...prev]);
      }
    });
  };

  return (
    <section className="mt-12 pt-8 border-t">
      <h2 className="text-xl font-semibold mb-6">
        评论 ({localComments.length})
      </h2>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-3">
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name || "用户"}
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm">
              {session?.user?.name?.charAt(0) || "游"}
            </div>
          )}
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={session ? "写下你的评论..." : "请先登录后再评论"}
              disabled={!session || isPending}
              className="w-full min-h-[100px] p-3 rounded-lg border border-input bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring/50 disabled:opacity-50"
            />
            <div className="flex justify-end mt-2">
              <button
                type="submit"
                disabled={!session || isPending || !content.trim()}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
                {isPending ? "发表中..." : "发表评论"}
              </button>
            </div>
          </div>
        </div>
      </form>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {localComments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex gap-3 p-4 rounded-lg bg-card border border-border"
            >
              {comment.author.avatarUrl ? (
                <Image
                  src={comment.author.avatarUrl}
                  alt={comment.author.name || "用户"}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm flex-shrink-0">
                  {comment.author.name?.charAt(0) || "游"}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">
                    {comment.author.name || "匿名用户"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(comment.createdAt).toLocaleDateString("zh-CN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                  {comment.content}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {localComments.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            暂无评论，来发表第一篇评论吧
          </p>
        )}
      </div>
    </section>
  );
}
