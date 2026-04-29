"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormField } from "@/components/ui/form";
import { cn } from "@/lib/utils";

const settingsSchema = z.object({
  name: z.string().min(1, "名称不能为空"),
  bio: z.string().max(200, "简介最多200字").optional(),
});

type SettingsValues = z.infer<typeof settingsSchema>;

function FormItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("space-y-2", className)}>{children}</div>;
}

function FormLabel({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium leading-none">
      {children}
    </label>
  );
}

function FormMessage({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return <p className="text-sm font-medium text-destructive">{children}</p>;
}

export default function SettingsPage() {
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: async () => {
      const res = await fetch("/api/user/profile");
      if (res.ok) {
        const data = await res.json();
        return { name: data.name || "", bio: data.bio || "" };
      }
      return { name: "", bio: "" };
    },
  });

  const onSubmit = async (data: SettingsValues) => {
    setSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success("保存成功");
      } else {
        toast.error("保存失败");
      }
    } catch {
      toast.error("保存失败");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold tracking-tight mb-8">个人设置</h1>

        <Card>
          <CardHeader>
            <CardTitle>基本信息</CardTitle>
            <CardDescription>修改您的个人资料</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <FormItem>
                <FormLabel htmlFor="name">名称</FormLabel>
                <Input id="name" {...register("name")} placeholder="您的名称" />
                {errors.name && <FormMessage>{errors.name.message}</FormMessage>}
              </FormItem>

              <FormItem>
                <FormLabel htmlFor="bio">简介</FormLabel>
                <Textarea
                  id="bio"
                  {...register("bio")}
                  placeholder="介绍一下自己..."
                  className="min-h-[100px] resize-none"
                />
                {errors.bio && <FormMessage>{errors.bio.message}</FormMessage>}
                <p className="text-xs text-muted-foreground mt-1">
                  最多200字，将显示在首页欢迎区域
                </p>
              </FormItem>

              <Button type="submit" disabled={saving}>
                {saving ? "保存中..." : "保存"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
