"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function FlashlightEffect() {
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (resolvedTheme !== "dark") return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [resolvedTheme]);

  if (!mounted || resolvedTheme !== "dark") return null;

  return (
    <div
      className="fixed inset-0 z-[70] pointer-events-none"
      style={{
        background: `radial-gradient(circle 300px at ${mousePosition.x}px ${mousePosition.y}px, transparent 0%, rgba(0,0,0,0.6) 100%)`,
      }}
    />
  );
}
