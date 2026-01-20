import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="bg-[#f7f6f2] flex justify-center px-4 py-16 font-Manrope">
      <div className="w-full max-w-md">
        <SignIn
          signUpUrl="/sign-up"
          redirectUrl="/auth/redirect"
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: " border border-[#e6e6e6]",
            },
          }}
        />
      </div>
    </main>
  );
}
