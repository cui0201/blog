import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { PostManagement } from "./PostManagement";

interface DashboardPageProps {
  params: Promise<{ id: string }>;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user || session.user.id !== id) {
    redirect("/login");
  }

  const posts = await prisma.post.findMany({
    where: { authorId: id },
    select: {
      id: true,
      title: true,
      slug: true,
      isPrivate: true,
      published: true,
      createdAt: true,
      _count: {
        select: { likes: true, comments: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">文章管理</h1>
        <a
          href="/editor/new"
          className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          写文章
        </a>
      </div>

      <PostManagement posts={posts} userId={id} />
    </div>
  );
}
