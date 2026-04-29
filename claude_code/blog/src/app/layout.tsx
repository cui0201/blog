import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/Providers";
import { PageTransition } from "@/components/PageTransition";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "清风逸的博客",
  description: "个人技术博客，分享学习与思考",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen flex flex-col antialiased">
        <Providers>
          <Navbar />
          <main className="flex-1 mx-auto w-full max-w-3xl px-4 py-8">
            <PageTransition>{children}</PageTransition>
          </main>
          <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
            © 2026 清风逸. All rights reserved.
          </footer>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
