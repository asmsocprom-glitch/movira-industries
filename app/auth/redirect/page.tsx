import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function AuthRedirectPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await currentUser();
  const role = user?.publicMetadata?.role;

  if (role === "admin") {
    redirect("/admin");
  }

  if (role === "supplier") {
    redirect("/supplier");
  }

  // fallback (optional)
  redirect("/");
}
