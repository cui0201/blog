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
    <div className="min-h-screen flex flex-col justify-center items-center text-center px-4">
      <div className="h-4 w-20 bg-muted rounded animate-pulse mb-4" />
      <div className="h-14 w-80 bg-muted rounded animate-pulse mb-6" />
      <div className="h-6 w-[28rem] bg-muted rounded animate-pulse max-w-xl" />
    </div>
  );
}

function FullScreenBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Solid background for light mode */}
      <div className="absolute inset-0 bg-white dark:bg-zinc-950" />
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5" />

      {/* Animated orbs - positioned relative to viewport */}
      <motion.div
        className="absolute w-[900px] h-[900px] rounded-full opacity-[0.07]"
        style={{
          background: "radial-gradient(circle, rgba(139, 92, 246, 1) 0%, transparent 70%)",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
        animate={{
          x: ["-50%", "-50%", "-50%"],
          y: ["-50%", "-45%", "-50%"],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute w-[700px] h-[700px] rounded-full opacity-[0.05]"
        style={{
          background: "radial-gradient(circle, rgba(59, 130, 246, 1) 0%, transparent 70%)",
          left: "25%",
          top: "30%",
        }}
        animate={{
          x: [0, 80, 0],
          y: [0, -40, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full opacity-[0.05]"
        style={{
          background: "radial-gradient(circle, rgba(236, 72, 153, 1) 0%, transparent 70%)",
          right: "15%",
          bottom: "20%",
        }}
        animate={{
          x: [0, -60, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Subtle grid pattern */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.02]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
}

function TextGlow({ mousePosition }: { mousePosition: { x: number; y: number } }) {
  return (
    <div
      className="absolute inset-0 -z-5 pointer-events-none overflow-hidden"
      style={{ transform: "translateZ(0)" }}
    >
      <motion.div
        className="absolute w-[500px] h-[200px] rounded-full opacity-[0.15]"
        style={{
          background: "radial-gradient(ellipse, rgba(139, 92, 246, 0.4) 0%, transparent 70%)",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
        animate={{
          x: `${(mousePosition.x - 0.5) * 100}px`,
          y: `${(mousePosition.y - 0.5) * 50}px`,
        }}
        transition={{
          type: "spring",
          stiffness: 50,
          damping: 20,
        }}
      />
    </div>
  );
}

const letterVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

export function HeroSection({ userName, userBio, isOwner = false, isUserSpace = false }: HeroSectionProps) {
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (!mounted) {
    return <HeroSkeleton />;
  }

  const displayName = userName || "创作者";

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
    <div className="relative">
      <FullScreenBackground />

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative min-h-screen flex flex-col justify-center items-center text-center px-4"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="relative z-10"
        >
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-sm text-muted-foreground tracking-[0.3em] uppercase mb-8"
          >
            {isUserSpace ? (isOwner ? "欢迎回来" : "个人空间") : "探索精彩内容"}
          </motion.p>

          <div className="mb-8 relative">
            {/* Text glow behind gradient text */}
            <TextGlow mousePosition={mousePosition} />

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight flex items-center justify-center flex-wrap gap-2"
            >
              {prefixLetters.length > 0 && (
                <span className="text-foreground">
                  {prefixLetters.map((letter, i) => (
                    <motion.span
                      key={`p-${i}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 + i * 0.05, duration: 0.3 }}
                      className="inline-block"
                    >
                      {letter}
                    </motion.span>
                  ))}
                </span>
              )}

              <span className="relative">
                <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-clip-text text-transparent animate-gradient">
                  {contentLetters.map((letter, i) => (
                    <motion.span
                      key={`c-${i}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 + i * 0.05, duration: 0.3 }}
                      className="inline-block"
                    >
                      {letter}
                    </motion.span>
                  ))}
                </span>
              </span>
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed px-4"
          >
            {subtitle}
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <ScrollIndicator />
        </motion.div>
      </motion.section>
    </div>
  );
}
