"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { User as UserIcon, Settings, LogOut, Home, PenLine, Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (href: string) => pathname === href;

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="backdrop-blur-md/80 bg-white/30 dark:bg-black/30 supports-[backdrop-filter]:bg-white/20 dark:supports-[backdrop-filter]:bg-black/30">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 md:px-8">
          <nav className="flex items-center gap-1">
            <Link
              href="/"
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200",
                isActive("/")
                  ? "bg-white/50 dark:bg-white/20 text-foreground"
                  : "text-foreground/70 hover:text-foreground hover:bg-white/30 dark:hover:bg-white/10"
              )}
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">探索</span>
            </Link>
          </nav>

          <div className="flex items-center gap-1">
            {mounted && (
              <button
                onClick={toggleTheme}
                className="flex items-center justify-center w-9 h-9 rounded-full text-foreground/70 hover:text-foreground hover:bg-white/30 dark:hover:bg-white/10 transition-all duration-200"
                aria-label="切换主题"
              >
                {resolvedTheme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </button>
            )}

            {session?.user ? (
              <>
                <Link
                  href={`/user/${session.user.id}`}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200",
                    pathname.startsWith("/user")
                      ? "bg-white/50 dark:bg-white/20 text-foreground"
                      : "text-foreground/70 hover:text-foreground hover:bg-white/30 dark:hover:bg-white/10"
                  )}
                >
                  <UserIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">我的空间</span>
                </Link>
                <Link
                  href="/editor/new"
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200",
                    pathname === "/editor/new"
                      ? "bg-white/50 dark:bg-white/20 text-foreground"
                      : "text-foreground/70 hover:text-foreground hover:bg-white/30 dark:hover:bg-white/10"
                  )}
                >
                  <PenLine className="h-4 w-4" />
                  <span className="hidden sm:inline">写文章</span>
                </Link>
                <Link
                  href="/settings"
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200",
                    isActive("/settings")
                      ? "bg-white/50 dark:bg-white/20 text-foreground"
                      : "text-foreground/70 hover:text-foreground hover:bg-white/30 dark:hover:bg-white/10"
                  )}
                >
                  <Settings className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-full text-foreground/70 hover:text-foreground hover:bg-white/30 dark:hover:bg-white/10 transition-all duration-200"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
                >
                  登录
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-medium bg-white/80 dark:bg-white/20 backdrop-blur-sm text-foreground rounded-full hover:bg-white/90 dark:hover:bg-white/30 transition-colors"
                >
                  注册
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}
