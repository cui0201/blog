import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PostCard, PostCardSkeleton } from "@/components/PostCard";
import { HeroSection } from "@/components/HeroSection";
import { Post } from "@/types";

export default async function HomePage() {
  const session = await auth();

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
    <div>
      <HeroSection userName={session?.user?.name} userBio={null} />

      <section className="py-16 px-4">
        <h2 className="text-2xl font-bold tracking-tight mb-8">
          发现创作
        </h2>
        {formattedPosts.length === 0 ? (
          <div className="grid gap-4 md:gap-6">
            {[...Array(3)].map((_, i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:gap-6">
            {formattedPosts.map((post, index) => (
              <PostCard key={post.id} post={post} index={index} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
