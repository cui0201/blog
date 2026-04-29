"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const registerSchema = z.object({
  name: z.string().min(2, "名字至少需要2个字符"),
  email: z.string().email("请输入有效的邮箱地址"),
  password: z.string().min(6, "密码至少需要6个字符"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "两次密码输入不一致",
  path: ["confirmPassword"],
});

type RegisterValues = z.infer<typeof registerSchema>;

function FormItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("space-y-2", className)}>{children}</div>;
}

function FormLabel({ children, className, htmlFor }: { children: React.ReactNode; className?: string; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className={cn("text-sm font-medium leading-none", className)}>
      {children}
    </label>
  );
}

function FormMessage({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return <p className="text-sm font-medium text-destructive">{children}</p>;
}

export default function RegisterPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: RegisterValues) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.name, email: data.email, password: data.password }),
      });

      if (response.ok) {
        toast.success("注册成功，请登录");
        router.push("/login?registered=true");
      } else {
        const result = await response.json();
        toast.error(result.error || "注册失败");
      }
    } catch {
      toast.error("服务器错误，请稍后重试");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" />
            返回首页
          </Link>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">注册</CardTitle>
            <CardDescription className="text-center">创建一个新账号</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormItem>
                <FormLabel htmlFor="name">名字</FormLabel>
                <Input id="name" placeholder="您的名字" {...register("name")} />
                {errors.name && <FormMessage>{errors.name.message}</FormMessage>}
              </FormItem>

              <FormItem>
                <FormLabel htmlFor="email">邮箱</FormLabel>
                <Input id="email" type="email" placeholder="your@email.com" {...register("email")} />
                {errors.email && <FormMessage>{errors.email.message}</FormMessage>}
              </FormItem>

              <FormItem>
                <FormLabel htmlFor="password">密码</FormLabel>
                <Input id="password" type="password" placeholder="••••••••" {...register("password")} />
                {errors.password && <FormMessage>{errors.password.message}</FormMessage>}
              </FormItem>

              <FormItem>
                <FormLabel htmlFor="confirmPassword">确认密码</FormLabel>
                <Input id="confirmPassword" type="password" placeholder="••••••••" {...register("confirmPassword")} />
                {errors.confirmPassword && <FormMessage>{errors.confirmPassword.message}</FormMessage>}
              </FormItem>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "注册中..." : "注册"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              已有账号?{" "}
              <Link href="/login" className="text-primary hover:underline">登录</Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
