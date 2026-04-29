import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { NewEditorClient } from "./NewEditorClient";

export default async function NewEditorPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return <NewEditorClient userId={session.user.id} />;
}