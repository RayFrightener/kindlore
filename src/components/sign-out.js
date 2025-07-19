"use client";
import { signOut } from "next-auth/react";

export default function SignOut({ onSignOut }) {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
    if (onSignOut) onSignOut();
  };

  return (
    <button
      onClick={handleSignOut}
      className="px-4 py-2 rounded-lg bg-[#BEBABA] cursor-pointer"
    >
      Sign Out
    </button>
  );
}