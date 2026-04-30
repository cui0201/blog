"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";

export function InteractiveSpotlight() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
    if (!isVisible) setIsVisible(true);
  }, [isVisible]);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const hideTimeout = setTimeout(() => {
      const handleMouseLeave = () => setIsVisible(false);
      document.body.addEventListener("mouseleave", handleMouseLeave);
      return () => document.body.removeEventListener("mouseleave", handleMouseLeave);
    }, 2000);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(hideTimeout);
    };
  }, [handleMouseMove]);

  if (shouldReduceMotion) return null;

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%)",
          left: mousePosition.x,
          top: mousePosition.y,
          x: "-50%",
          y: "-50%",
        }}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: isVisible ? 1 : 0.5,
        }}
        transition={{
          duration: 0.3,
          ease: "easeOut",
        }}
      />
    </motion.div>
  );
}
