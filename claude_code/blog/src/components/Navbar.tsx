"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Compass, User as UserIcon, Settings, LogOut, Home, PenLine } from "lucide-react";
import { motion } from "framer-motion";

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isActive = (href: string) => pathname === href;

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full"
    >
      <div className="backdrop-blur-xl bg-white/70 dark:bg-black/40 supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 md:px-8">
          <nav className="flex items-center gap-1">
            <Link
              href="/"
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200",
                isActive("/")
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">探索</span>
            </Link>
          </nav>

          <div className="flex items-center gap-1">
            {session?.user ? (
              <>
                <Link
                  href={`/user/${session.user.id}`}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200",
                    pathname.startsWith("/user")
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
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
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
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
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <Settings className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  登录
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
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
