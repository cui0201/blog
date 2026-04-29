"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ScrollIndicator } from "@/components/ScrollIndicator";

interface HeroSectionProps {
  userName?: string | null;
  userBio?: string | null;
  isOwner?: boolean;
  isUserSpace?: boolean;
}

function HeroSkeleton() {
  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center text-center px-4">
      <div className="h-4 w-20 bg-muted rounded animate-pulse mb-4" />
      <div className="h-14 w-80 bg-muted rounded animate-pulse mb-6" />
      <div className="h-6 w-[28rem] bg-muted rounded animate-pulse max-w-xl" />
    </div>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.3,
    },
  },
};

const letterVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut" as const,
    },
  },
};

const bioVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

export function HeroSection({ userName, userBio, isOwner = false, isUserSpace = false }: HeroSectionProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <HeroSkeleton />;
  }

  const displayName = userName || "媛媛大人";
  const isLoggedIn = !!userName;

  let titlePrefix = "";
  let titleContent = "";
  let subtitle = "";

  if (isUserSpace) {
    if (isOwner) {
      titlePrefix = "你好，";
      titleContent = displayName;
      subtitle = "管理你的创作灵感";
    } else {
      titlePrefix = "";
      titleContent = `${displayName} 的空间`;
      subtitle = userBio || "这个人很懒，什么都没写";
    }
  } else {
    titlePrefix = "欢迎来到";
    titleContent = "创作社区";
    subtitle = "发现有趣的灵魂与故事";
  }

  const prefixLetters = titlePrefix.split("");
  const contentLetters = titleContent.split("");

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-[80vh] flex flex-col justify-center items-center text-center px-4"
    >
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-sm text-muted-foreground tracking-[0.3em] uppercase mb-8"
      >
        {isUserSpace ? (isOwner ? "欢迎回来" : "个人空间") : "探索精彩内容"}
      </motion.p>

      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex items-center justify-center text-4xl md:text-6xl font-bold tracking-tight flex-wrap gap-1"
        >
          {prefixLetters.length > 0 && (
            <div className="overflow-hidden">
              <motion.span
                className="inline-block text-foreground"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {prefixLetters.map((letter, i) => (
                  <motion.span key={`p-${i}`} variants={letterVariants} className="inline-block">
                    {letter}
                  </motion.span>
                ))}
              </motion.span>
            </div>
          )}
          <div className="overflow-hidden">
            <motion.span
              className="inline-block bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {contentLetters.map((letter, i) => (
                <motion.span key={`c-${i}`} variants={letterVariants} className="inline-block">
                  {letter}
                </motion.span>
              ))}
            </motion.span>
          </div>
        </motion.div>
      </div>

      <motion.p
        variants={bioVariants}
        initial="hidden"
        animate="visible"
        className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed px-4"
      >
        {subtitle}
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="mt-20"
      >
        <ScrollIndicator />
      </motion.div>
    </motion.section>
  );
}
