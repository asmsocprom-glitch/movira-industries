"use client";

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="bg-[#f7f6f2] flex justify-center px-4 py-16 font-Manrope">
      <div className="w-full max-w-md">
        <SignUp
          path="/sign-up"
          routing="path"
          signInUrl="/sign-in"
          afterSignUpUrl="/select-role"
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "border border-[#e6e6e6]",
            },
          }}
        />
      </div>
    </main>
  );
}
