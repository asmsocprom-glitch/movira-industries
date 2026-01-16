"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function AuthRedirectPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      router.replace("/sign-in");
      return;
    }

    const role = user.publicMetadata?.role;
    if (role === "admin") router.replace("/admin");
    else if (role === "supplier") router.replace("/supplier");
    else if (role === "client") router.replace("/client");
    else router.replace("/select-role");
  }, [user, isLoaded, router]);

  return <div className="h-screen flex items-center justify-center">Redirecting...</div>;
}
