"use client";
import React, { createContext, useContext, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useEncryptionKey } from "@/components/EncryptionKeyContext";
import { decryptWithKey } from "@/utils/eternal/encryptionUtils";

// Types
export interface Clipping {
  id: number;
  time: string;
  date: string;
  clipping: string;
}
export type ClippingsData = Record<string, Clipping[]>;

interface ClippingsContextType {
  clippings: ClippingsData | null;
  books: string[];
  loading: boolean;
  refreshClippings: () => Promise<void>;
}

const ClippingsContext = createContext<ClippingsContextType>({
  clippings: null,
  books: [],
  loading: false,
  refreshClippings: async () => {},
});

export function ClippingsProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const { encryptionKey } = useEncryptionKey();
  const [clippings, setClippings] = useState<ClippingsData | null>(null);
  const [books, setBooks] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshClippings = useCallback(async () => {
    if (!session || !encryptionKey) {
      setClippings(null);
      setBooks([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/books");
      const { books: apiBooks } = await res.json();
      if (!apiBooks || apiBooks.length === 0) {
        setClippings(null);
        setBooks([]);
        setLoading(false);
        return;
      }
      const decryptedData: ClippingsData = {};
      for (const book of apiBooks) {
        try {
          const title = await decryptWithKey(
            encryptionKey,
            book.title,
            book.titleIv
          );
          decryptedData[title] = [];
          for (const clip of book.clippings) {
            try {
              const clippingText = await decryptWithKey(
                encryptionKey,
                clip.highlight,
                clip.iv
              );
              const addedAt = clip.addedAt ? new Date(clip.addedAt) : null;
              const dateStr = addedAt
                ? addedAt.toLocaleDateString(undefined, {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "";
              const timeStr = addedAt
                ? addedAt.toLocaleTimeString(undefined, {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })
                : "";
              decryptedData[title].push({
                id: clip.id,
                date: dateStr,
                time: timeStr,
                clipping: clippingText,
              });
            } catch {}
          }
        } catch {}
      }
      setClippings(decryptedData);
      setBooks(Object.keys(decryptedData));
      setLoading(false);
    } catch {
      setClippings(null);
      setBooks([]);
      setLoading(false);
    }
  }, [session, encryptionKey]);

  // Optionally: auto-refresh on mount or when session/encryptionKey changes
  React.useEffect(() => {
    refreshClippings();
  }, [refreshClippings]);

  return (
    <ClippingsContext.Provider
      value={{ clippings, books, loading, refreshClippings }}
    >
      {children}
    </ClippingsContext.Provider>
  );
}

export function useClippings() {
  return useContext(ClippingsContext);
}
