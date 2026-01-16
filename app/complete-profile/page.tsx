import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ProfileForm from "./ProfileForm/page";

export default async function CompleteProfilePage() {
  const user = await currentUser();

  if (!user || user.publicMetadata?.role !== "client") {
    redirect("/");
  }

  return <ProfileForm />;
}
