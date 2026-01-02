"use client";

import { SignInButton } from "@clerk/nextjs";

export function SignInCTA() {
  return (
    <SignInButton mode="redirect" forceRedirectUrl="/auth/redirect">
      <button className="px-6 py-3 rounded-xl bg-black text-white">
        Sign in
      </button>
    </SignInButton>
  );
}
