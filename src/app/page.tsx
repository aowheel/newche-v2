"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <Button
        variant="outline"
      >
        <Link
          href="/view"
        >
          はじめる
        </Link>
      </Button>
    </main>
  );
}
