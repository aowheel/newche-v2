import type { Metadata } from "next";
import "./globals.css";
import { notoSansJP } from "@/lib/fonts";
import { ReactNode, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import Loading from "./loading";

export const metadata: Metadata = {
  title: "Newche",
  description: "App for Institute of Science Tokyo scycle-ball team",
};

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
