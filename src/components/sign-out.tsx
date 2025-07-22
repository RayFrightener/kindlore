"use client";
import { signOut } from "next-auth/react";

export default function SignOut({ onSignOut }: { onSignOut?: () => void }) {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
    if (onSignOut) onSignOut();
  };

  return (
    <button
      onClick={handleSignOut}
      className="py-2 rounded font-semibold cursor-pointer text-sm"
    >
      Sign Out
    </button>
  );
}