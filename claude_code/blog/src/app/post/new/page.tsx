"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { MarkdownEditor } from "@/components/MarkdownEditor";

const postSchema = z.object({
  title: z.string().min(1, "标题不能为空").max(200, "标题最多200个字符"),
  slug: z.string().min(1, "slug不能为空").regex(/^[a-z0-9-]+$/, "slug只能包含小写字母、数字和连字符"),
  excerpt: z.string().max(300, "摘要最多300个字符").optional(),
  content: z.string().min(1, "内容不能为空"),
  tags: z.string().optional(),
});

type PostValues = z.infer<typeof postSchema>;

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

export default function NewPostPage() {
  const router = useRouter();

  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<PostValues>({
    resolver: zodResolver(postSchema),
    defaultValues: { title: "", slug: "", excerpt: "", content: "", tags: "" },
  });

  const onSubmit = async (data: PostValues) => {
    const tags = data.tags ? data.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, tags }),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success("文章发布成功");
        router.push(`/posts/${result.slug}`);
      } else {
        const result = await response.json();
        toast.error(result.error || "发布失败");
        setError("root", { message: result.error || "发布失败" });
      }
    } catch (error) {
      toast.error("服务器错误，请稍后重试");
      setError("root", { message: "服务器错误，请稍后重试" });
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="mb-8">
          <Link href="/admin" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" />
            返回后台
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              写文章
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {errors.root && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                  {errors.root.message}
                </div>
              )}

              <FormItem>
                <FormLabel htmlFor="title">标题</FormLabel>
                <Input id="title" placeholder="文章标题" {...register("title")} />
                {errors.title && <FormMessage>{errors.title.message}</FormMessage>}
              </FormItem>

              <FormItem>
                <FormLabel htmlFor="slug">URL Slug</FormLabel>
                <Input id="slug" placeholder="article-url-slug" {...register("slug")} />
                {errors.slug && <FormMessage>{errors.slug.message}</FormMessage>}
              </FormItem>

              <FormItem>
                <FormLabel htmlFor="excerpt">摘要（可选）</FormLabel>
                <Input id="excerpt" placeholder="文章简要描述" {...register("excerpt")} />
                {errors.excerpt && <FormMessage>{errors.excerpt.message}</FormMessage>}
              </FormItem>

              <FormItem>
                <FormLabel htmlFor="tags">标签（可选，用逗号分隔）</FormLabel>
                <Input id="tags" placeholder="Next.js, TypeScript, Tailwind" {...register("tags")} />
                {errors.tags && <FormMessage>{errors.tags.message}</FormMessage>}
              </FormItem>

              <FormItem>
                <FormLabel htmlFor="content">内容</FormLabel>
                <MarkdownEditor
                  value={""}
                  onChange={(value) => {
                    const event = { target: { name: "content", value } };
                    register("content").onChange(event as any);
                  }}
                  placeholder="使用 Markdown 编写文章内容..."
                />
                {errors.content && <FormMessage>{errors.content.message}</FormMessage>}
              </FormItem>

              <div className="flex gap-4">
                <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "发布中..." : "发布"}</Button>
                <Button type="button" variant="outline" onClick={() => router.push("/admin")}>取消</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
