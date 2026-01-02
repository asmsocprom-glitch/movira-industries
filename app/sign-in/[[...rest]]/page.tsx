import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <SignIn
      redirectUrl="/auth/redirect"
      appearance={{
        elements: {
          rootBox: "mx-auto mt-24",
        },
      }}
    />
  );
}
