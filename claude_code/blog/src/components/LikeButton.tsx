"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

interface LikeButtonProps {
  postId: string;
  initialCount?: number;
  initialLiked?: boolean;
}

export function LikeButton({ postId, initialCount = 0, initialLiked = false }: LikeButtonProps) {
  const { data: session } = useSession();
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [isPending, startTransition] = useTransition();

  const handleLike = () => {
    if (!session) {
      toast.error("请先登录后再点赞");
      return;
    }

    setLiked(!liked);
    setCount(liked ? count - 1 : count + 1);

    startTransition(async () => {
      try {
        const res = await fetch(`/api/posts/${postId}/like`, {
          method: "POST",
        });
        if (!res.ok) {
          setLiked(!liked);
          setCount(liked ? count + 1 : count - 1);
          toast.error("操作失败");
        }
      } catch {
        setLiked(!liked);
        setCount(liked ? count + 1 : count - 1);
        toast.error("操作失败");
      }
    });
  };

  return (
    <motion.button
      onClick={handleLike}
      disabled={isPending}
      whileTap={{ scale: 0.85 }}
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors",
        liked
          ? "text-red-500 bg-red-50 hover:bg-red-100"
          : "text-muted-foreground hover:text-red-500 hover:bg-red-50",
        isPending && "opacity-50"
      )}
    >
      <motion.div
        animate={liked ? { scale: [1, 1.3, 1] } : { scale: 1 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <Heart
          className={cn("h-5 w-5", liked && "fill-current")}
        />
      </motion.div>
      <span className="text-sm font-medium">{count}</span>
    </motion.button>
  );
}
