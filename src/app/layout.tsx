import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import SessionWrapper from "@/components/SessionWrapper";
import { EncryptionKeyProvider } from "@/components/EncryptionKeyContext";
import { ClippingsProvider } from "@/components/ClippingsContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kindlore",
  description: "organize and reflect on your kindle clippings",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionWrapper>
          <EncryptionKeyProvider>
            <ClippingsProvider>
              <Header />
              {children}
            </ClippingsProvider>
          </EncryptionKeyProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
