import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { ReactNode, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import Loading from "./loading";

export const metadata: Metadata = {
  title: "Newche",
  description: "App for Institute of Science Tokyo scycle-ball team",
};

const notoSansJP = Noto_Sans_JP({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${notoSansJP.className} flex flex-col items-center justify-center min-h-screen`}
      >
        <Suspense fallback={<Loading />}>
          {children}
          <Toaster />
        </Suspense>
      </body>
    </html>
  );
}
