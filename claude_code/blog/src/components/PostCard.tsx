"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Post } from "@/types";
import { Lock, Edit } from "lucide-react";
import Image from "next/image";
import { LikeButton } from "@/components/LikeButton";

interface PostCardProps {
  post: Post;
  index: number;
  showEdit?: boolean;
  currentUserId?: string;
}

export function PostCard({ post, index, showEdit = false, currentUserId }: PostCardProps) {
  const authorName = post.author?.name || "匿名用户";
  const isOwner = showEdit && currentUserId && post.author?.id === currentUserId;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      whileHover={{ scale: 1.01 }}
      className="group rounded-lg border border-border bg-card p-6 shadow-subtle transition-all duration-300 hover:border-muted-foreground/30 hover:shadow-md"
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">{post.publishedAt}</p>
            {post.isPrivate && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs">
                <Lock className="h-3 w-3" />
                仅自己可见
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isOwner && (
              <Link
                href={`/editor/${post.id}`}
                className="p-1.5 text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
                title="编辑"
              >
                <Edit className="h-4 w-4" />
              </Link>
            )}
            <LikeButton postId={post.id} initialCount={post._count?.likes || 0} />
          </div>
        </div>
        <Link href={`/posts/${post.id}`} className="block">
          <h3 className="font-medium text-lg leading-snug group-hover:text-foreground/80 transition-colors">
            {post.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mt-2">
            {post.excerpt}
          </p>
        </Link>
        <div className="flex items-center justify-between pt-2">
          <Link
            href={`/user/${post.author?.id}`}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {post.author?.avatarUrl ? (
              <Image
                src={post.author.avatarUrl}
                alt={authorName}
                width={24}
                height={24}
                className="rounded-full"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">
                {authorName.charAt(0)}
              </div>
            )}
            <span>{authorName}</span>
          </Link>
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 rounded-full bg-secondary text-xs text-secondary-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export function PostCardSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-subtle animate-pulse">
      <div className="space-y-3">
        <div className="h-4 w-24 bg-muted rounded" />
        <div className="h-6 w-3/4 bg-muted rounded" />
        <div className="space-y-2">
          <div className="h-4 w-full bg-muted rounded" />
          <div className="h-4 w-2/3 bg-muted rounded" />
        </div>
        <div className="flex gap-2 pt-2">
          <div className="h-5 w-16 bg-muted rounded-full" />
          <div className="h-5 w-20 bg-muted rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function EmptyState({ message = "暂无内容" }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 mb-4 rounded-full bg-muted flex items-center justify-center">
        <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
      <p className="text-muted-foreground text-lg">{message}</p>
    </div>
  );
}
