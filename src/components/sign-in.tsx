"use client";
import { signIn } from "next-auth/react";

export default function SignIn({ onSignInSuccess }: { onSignInSuccess?: () => void }) {
  const handleSignIn = async () => {
    await signIn("google");
    if (onSignInSuccess) onSignInSuccess();
  };

  return (
    <button
      onClick={handleSignIn}
      className="py-2 rounded font-semibold cursor-pointer text-sm"
    >
      Sign in
    </button>
  );
}
