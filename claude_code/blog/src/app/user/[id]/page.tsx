import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PostCard, PostCardSkeleton } from "@/components/PostCard";
import { HeroSection } from "@/components/HeroSection";
import { notFound } from "next/navigation";
import { Post } from "@/types";
import { PenLine } from "lucide-react";
import Link from "next/link";

interface UserPageProps {
  params: Promise<{ id: string }>;
}

export default async function UserPage({ params }: UserPageProps) {
  const { id } = await params;
  const session = await auth();
  const isOwner = session?.user?.id === id;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      avatarUrl: true,
      bio: true,
    },
  });

  if (!user) {
    notFound();
  }

  const posts = await prisma.post.findMany({
    where: {
      authorId: id,
      ...(isOwner ? {} : { isPrivate: false }),
    },
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
      <HeroSection
        userName={user.name}
        userBio={user.bio}
        isOwner={isOwner}
        isUserSpace={true}
      />

      {isOwner && (
        <div className="px-4 max-w-7xl mx-auto">
          <Link
            href="/editor/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-md hover:shadow-lg"
          >
            <PenLine className="h-4 w-4" />
            写文章
          </Link>
        </div>
      )}

      <section className="py-8 px-4">
        <h2 className="text-2xl font-bold tracking-tight mb-8 max-w-7xl mx-auto">
          {isOwner ? "我的文章" : "公开文章"}
        </h2>
        {formattedPosts.length === 0 ? (
          <div className="grid gap-4 md:gap-6 max-w-7xl mx-auto">
            {[...Array(2)].map((_, i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:gap-6 max-w-7xl mx-auto">
            {formattedPosts.map((post, index) => (
              <PostCard
                key={post.id}
                post={post}
                index={index}
                showEdit={isOwner}
                currentUserId={id}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
