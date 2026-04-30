"use client";

import { useEffect, useState } from "react";

export function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      setProgress(scrolled / scrollHeight);
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();

    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-[2px] bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-primary via-purple-500 to-pink-500 transition-all duration-100 ease-out"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
}
