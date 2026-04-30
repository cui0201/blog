"use client";

import { useEffect, useState, useRef } from "react";
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

function AnimatedMeshGradient() {
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden"
      style={{ perspective: "1000px" }}
    >
      {/* Base gradient layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5" />

      {/* Animated orbs */}
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full opacity-[0.08]"
        style={{
          background: "radial-gradient(circle, rgba(139, 92, 246, 1) 0%, transparent 70%)",
          left: "50%",
          top: "50%",
          x: "-50%",
          y: "-50%",
        }}
        animate={{
          x: "-50%",
          y: "-50%",
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full opacity-[0.06]"
        style={{
          background: "radial-gradient(circle, rgba(59, 130, 246, 1) 0%, transparent 70%)",
          left: "30%",
          top: "40%",
        }}
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute w-[700px] h-[700px] rounded-full opacity-[0.06]"
        style={{
          background: "radial-gradient(circle, rgba(236, 72, 153, 1) 0%, transparent 70%)",
          right: "20%",
          bottom: "20%",
        }}
        animate={{
          x: [0, -80, 0],
          y: [0, 60, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Mouse reactive glow */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)",
          left: `${mousePosition.x * 100}%`,
          top: `${mousePosition.y * 100}%`,
          x: "-50%",
          y: "-50%",
        }}
        animate={{
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Subtle grid pattern */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.03]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
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
  hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

const titleVariants = {
  hidden: { opacity: 0, scale: 0.95, filter: "blur(20px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 1,
      ease: "easeOut" as const,
    },
  },
};

const bioVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
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

  const displayName = userName || "创作者";
  const isLoggedIn = !!userName;

  let titlePrefix = "";
  let titleContent = "";
  let subtitle = "";

  if (isUserSpace) {
    if (isOwner) {
      titlePrefix = "";
      titleContent = displayName;
      subtitle = "探索你的创作世界";
    } else {
      titlePrefix = "";
      titleContent = `${displayName}`;
      subtitle = userBio || "这个人很懒，什么都没写";
    }
  } else {
    titlePrefix = "";
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
      className="relative min-h-[80vh] flex flex-col justify-center items-center text-center px-4 overflow-hidden"
    >
      <AnimatedMeshGradient />

      <motion.div
        variants={titleVariants}
        initial="hidden"
        animate="visible"
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

        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex items-center justify-center text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter flex-wrap gap-2"
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
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute bottom-10"
      >
        <ScrollIndicator />
      </motion.div>
    </motion.section>
  );
}
