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
      whileHover={{ scale: 1.005 }}
      className="group relative rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm p-6 shadow-sm transition-all duration-300 overflow-hidden"
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Animated border beam */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 rounded-xl p-[1px] bg-gradient-to-r from-primary/50 via-purple-500/50 to-pink-500/50 mask-gradient" />
      </div>

      {/* Content */}
      <div className="relative z-10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground/80">{post.publishedAt}</p>
            {post.isPrivate && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100/80 text-amber-700 text-xs backdrop-blur-sm">
                <Lock className="h-3 w-3" />
                私密
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
          <h3 className="font-semibold text-lg tracking-tight group-hover:text-primary/80 transition-colors">
            {post.title}
          </h3>
          <p className="text-sm text-muted-foreground/80 leading-relaxed line-clamp-2 mt-2">
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
                src={post.author?.avatarUrl}
                alt={authorName}
                width={24}
                height={24}
                className="rounded-full"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/50 to-purple-500/50 flex items-center justify-center text-xs text-white">
                {authorName.charAt(0)}
              </div>
            )}
            <span>{authorName}</span>
          </Link>
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-full bg-muted/80 text-xs text-muted-foreground backdrop-blur-sm"
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
    <div className="rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm p-6 shadow-sm animate-pulse">
      <div className="space-y-3">
        <div className="h-4 w-24 bg-muted/50 rounded" />
        <div className="h-6 w-3/4 bg-muted/50 rounded" />
        <div className="space-y-2">
          <div className="h-4 w-full bg-muted/50 rounded" />
          <div className="h-4 w-2/3 bg-muted/50 rounded" />
        </div>
        <div className="flex gap-2 pt-2">
          <div className="h-5 w-16 bg-muted/50 rounded-full" />
          <div className="h-5 w-20 bg-muted/50 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function EmptyState({ message = "暂无内容" }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center">
        <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
      <p className="text-muted-foreground text-lg">{message}</p>
    </div>
  );
}
