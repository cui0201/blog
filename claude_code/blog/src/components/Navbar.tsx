"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Compass, User as UserIcon, Settings, LogOut, Home } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isActive = (href: string) => pathname === href;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className={cn(
              "flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-foreground",
              isActive("/") ? "text-foreground" : "text-muted-foreground"
            )}
          >
            <Home className="h-4 w-4" />
            探索
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {session?.user ? (
            <>
              <Link
                href={`/user/${session.user.id}`}
                className={cn(
                  "flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-foreground",
                  pathname.startsWith("/user") ? "text-foreground" : "text-muted-foreground"
                )}
              >
                <UserIcon className="h-4 w-4" />
                我的空间
              </Link>
              <Link
                href="/settings"
                className={cn(
                  "flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-foreground",
                  isActive("/settings") ? "text-foreground" : "text-muted-foreground"
                )}
              >
                <Settings className="h-4 w-4" />
                设置
              </Link>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
                退出
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              登录
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
