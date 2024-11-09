import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Newche",
  description: "App for Institute of Science Tokyo scycle-ball team",
};

const notoSansJP = Noto_Sans_JP({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={notoSansJP.className}
      >
        {children}
      </body>
    </html>
  );
}
