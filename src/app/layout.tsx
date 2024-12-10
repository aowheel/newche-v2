import type { Metadata } from "next";
import { notoSansJP } from "@/lib/fonts";
import { ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

export const metadata: Metadata = {
  title: "Newche",
  description: "東京科学大学サイクリング部ボール班のスケジュール管理アプリ",
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
        {children}
        <Toaster />
      </body>
    </html>
  );
}
