import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PostCard, PostCardSkeleton } from "@/components/PostCard";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const posts = await prisma.post.findMany({
    where: { authorId: session.user.id },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
        },
      },
      _count: {
        select: { likes: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">管理后台</h1>
        <a
          href="/editor/new"
          className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          写文章
        </a>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">我的文章</h2>
        {posts.length === 0 ? (
          <div className="grid gap-4">
            {[...Array(2)].map((_, i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid gap-4">
            {posts.map((post, index) => (
              <PostCard
                key={post.id}
                post={{
                  id: post.id,
                  title: post.title,
                  slug: post.slug,
                  excerpt: post.excerpt || "",
                  content: post.content,
                  publishedAt: post.createdAt.toISOString().split("T")[0],
                  updatedAt: post.updatedAt.toISOString().split("T")[0],
                  tags: JSON.parse(post.tags),
                  isPrivate: post.isPrivate,
                  _count: { likes: post._count.likes },
                  author: post.author,
                }}
                index={index}
                showEdit={true}
                currentUserId={session.user.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
