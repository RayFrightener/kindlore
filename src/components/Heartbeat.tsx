"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function Heartbeat() {
  const { data: session } = useSession();

  useEffect(() => {
    // Only send heartbeat if user is authenticated
    if (!session) return;

    // Send heartbeat once per session (when component mounts)
    fetch("/api/heartbeat", { method: "POST" }).catch((err) => {
      // Silently fail - don't disrupt user experience
      console.error("Heartbeat failed:", err);
    });

    // Optional: Send heartbeat every hour to track more active sessions
    const interval = setInterval(() => {
      fetch("/api/heartbeat", { method: "POST" }).catch(() => {});
    }, 60 * 60 * 1000); // 1 hour

    return () => clearInterval(interval);
  }, [session]);

  return null; // This component doesn't render anything
}
