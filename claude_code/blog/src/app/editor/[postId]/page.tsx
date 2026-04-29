import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { EditorClient } from "./EditorClient";

interface EditorPageProps {
  params: Promise<{ postId: string }>;
}

export default async function EditorPage({ params }: EditorPageProps) {
  const { postId } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return <EditorClient postId={postId} userId={session.user.id} />;
}
