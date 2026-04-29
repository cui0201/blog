import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { auth } from "@/lib/auth";
import { CommentSection } from "@/components/CommentSection";

interface PostPageProps {
  params: Promise<{ id: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;
  const session = await auth();

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
        },
      },
    },
  });

  if (!post) {
    notFound();
  }

  const isOwner = session?.user?.id === post.authorId;
  if (post.isPrivate && !isOwner) {
    notFound();
  }

  const comments = await prisma.comment.findMany({
    where: { postId: id },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const formattedComments = comments.map((comment) => ({
    id: comment.id,
    content: comment.content,
    createdAt: comment.createdAt,
    author: comment.author,
  }));

  return (
    <article className="max-w-2xl mx-auto py-12">
      <header className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <Link
            href={`/user/${post.author.id}`}
            className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {post.author.avatarUrl ? (
              <Image
                src={post.author.avatarUrl}
                alt={post.author.name || "作者"}
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                {post.author.name?.charAt(0) || "?"}
              </div>
            )}
            <span>{post.author.name || "匿名用户"}</span>
          </Link>
          <span className="text-muted-foreground">·</span>
          <time className="text-sm text-muted-foreground">
            {post.createdAt.toISOString().split("T")[0]}
          </time>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="text-lg text-muted-foreground">{post.excerpt}</p>
        )}
      </header>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>

      <CommentSection postId={id} comments={formattedComments} />

      <footer className="mt-8 pt-6 border-t">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← 返回首页
        </Link>
      </footer>
    </article>
  );
}
