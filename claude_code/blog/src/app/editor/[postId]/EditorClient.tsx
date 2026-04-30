"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, Eye, Edit3, Lock, Globe, Save, AlertCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { upsertPost, getPostById } from "@/app/actions/post";

const postSchema = z.object({
  title: z.string().min(1, "标题不能为空").max(200),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "slug只能包含小写字母、数字和连字符").or(z.literal("")),
  excerpt: z.string().max(300).optional(),
  content: z.string().min(1, "内容不能为空"),
  isPrivate: z.boolean(),
});

type PostValues = z.infer<typeof postSchema>;

interface EditorClientProps {
  postId: string;
  userId: string;
}

export function EditorClient({ postId, userId }: EditorClientProps) {
  const router = useRouter();

  const [preview, setPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PostValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      isPrivate: false as boolean,
    },
  });

  const content = watch("content");
  const isPrivate = watch("isPrivate");

  useEffect(() => {
    if (postId) {
      getPostById(postId).then((post) => {
        if (!post) {
          setError("文章不存在或您没有权限编辑");
          setIsLoading(false);
          return;
        }
        setValue("title", post.title);
        setValue("slug", post.slug);
        setValue("excerpt", post.excerpt || "");
        setValue("content", post.content);
        setValue("isPrivate", post.isPrivate);
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, [postId, setValue]);

  const onSubmit = async (data: PostValues) => {
    setIsSaving(true);
    const result = await upsertPost(postId, {
      title: data.title,
      slug: data.slug,
      content: data.content,
      excerpt: data.excerpt,
      isPrivate: data.isPrivate,
    });

    if (result.error) {
      toast.error(result.error);
      setIsSaving(false);
    } else {
      toast.success("保存成功");
      router.push(`/user/${userId}`);
      router.refresh();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="animate-pulse text-muted-foreground">加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 pt-16">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <p className="text-lg text-muted-foreground">{error}</p>
        <Link
          href={`/user/${userId}`}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          返回主页
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background pt-16"
    >
      <header className="fixed top-0 left-0 right-0 z-[60] border-b bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={`/user/${userId}`}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              返回
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPreview(!preview)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors",
                preview
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted dark:hover:bg-white/10"
              )}
            >
              {preview ? (
                <>
                  <Edit3 className="h-4 w-4" />
                  编辑
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  预览
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setValue("isPrivate", !isPrivate)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors",
                isPrivate
                  ? "bg-amber-500/20 text-amber-400"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted dark:hover:bg-white/10"
              )}
            >
              {isPrivate ? (
                <>
                  <Lock className="h-4 w-4" />
                  私密
                </>
              ) : (
                <>
                  <Globe className="h-4 w-4" />
                  公开
                </>
              )}
            </button>

            <button
              onClick={handleSubmit(onSubmit)}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-1.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {isSaving ? "保存中..." : "保存"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <input
          {...register("title")}
          placeholder="文章标题"
          className="w-full text-4xl font-bold bg-transparent border-none outline-none placeholder:text-muted-foreground mb-6 dark:placeholder:text-zinc-600"
        />
        {errors.title && (
          <p className="text-sm text-destructive mb-4">{errors.title.message}</p>
        )}

        <div className="grid grid-cols-2 gap-6 min-h-[calc(100vh-200px)]">
          <div className={cn("space-y-4", preview && "hidden md:block")}>
            <label className="text-sm font-medium text-muted-foreground dark:text-zinc-400">摘要（可选）</label>
            <input
              {...register("excerpt")}
              placeholder="简短描述文章内容..."
              className="w-full px-0 py-2 text-foreground bg-transparent border-0 border-b border-border/50 dark:border-zinc-800 outline-none focus:border-primary dark:text-zinc-200 dark:placeholder:text-zinc-600"
            />

            <textarea
              {...register("content")}
              placeholder="使用 Markdown 编写..."
              className="w-full min-h-[calc(100vh-300px)] p-4 bg-zinc-100 dark:bg-zinc-900 rounded-lg border border-border dark:border-zinc-800 outline-none focus:ring-2 focus:ring-ring/50 resize-none font-mono text-sm text-foreground dark:text-zinc-200 dark:placeholder:text-zinc-600"
            />
            {errors.content && (
              <p className="text-sm text-destructive">{errors.content.message}</p>
            )}
          </div>

          {(preview || true) && (
            <div className="space-y-4 border-l pl-6 dark:border-zinc-800">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Eye className="h-4 w-4" />
                预览
              </div>
              <article className="prose prose-neutral dark:prose-invert max-w-none">
                <h1 className="text-3xl font-bold mb-4">{watch("title") || "无标题"}</h1>
                {watch("excerpt") && (
                  <p className="text-lg text-muted-foreground mb-6">{watch("excerpt")}</p>
                )}
                <ReactMarkdown>{content || "*正文预览将显示在这里*"}</ReactMarkdown>
              </article>
            </div>
          )}
        </div>
      </main>
    </motion.div>
  );
}
