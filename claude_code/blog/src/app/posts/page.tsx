import { prisma } from "@/lib/prisma";
import { PostCard, PostCardSkeleton } from "@/components/PostCard";
import { Post } from "@/types";

export default async function PostsPage() {
  const posts = await prisma.post.findMany({
    where: { isPrivate: false },
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

  const formattedPosts: Post[] = posts.map((post) => ({
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
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">文章</h1>

      {formattedPosts.length === 0 ? (
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid gap-4">
          {formattedPosts.map((post, index) => (
            <PostCard key={post.id} post={post} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
