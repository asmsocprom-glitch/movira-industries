import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ClientDashboard from "./ClientDashboard";

export default async function ClientDashboardPage() {
  const user = await currentUser();

  if (!user || user.publicMetadata?.role !== "client") {
    redirect("/")
  }

  return <ClientDashboard />
}
