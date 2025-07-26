"use client";
import React, { createContext, useContext, useState } from "react";

export const EncryptionKeyContext = createContext<{
  encryptionKey: CryptoKey | null;
  setEncryptionKey: (key: CryptoKey | null) => void;
}>({
  encryptionKey: null,
  setEncryptionKey: () => {},
});

export function EncryptionKeyProvider({ children }: { children: React.ReactNode }) {
  const [encryptionKey, setEncryptionKey] = useState<CryptoKey | null>(null);

  return (
    <EncryptionKeyContext.Provider value={{ encryptionKey, setEncryptionKey }}>
      {children}
    </EncryptionKeyContext.Provider>
  );
}

// Custom hook for easy access
export function useEncryptionKey() {
  return useContext(EncryptionKeyContext);
}