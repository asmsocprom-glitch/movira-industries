import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function SupplierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await currentUser();

  if (user?.publicMetadata?.role !== "supplier") {
    redirect("/");
  }

  return <>{children}</>;
}
