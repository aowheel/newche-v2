"use client";

import { Button } from "@/components/ui/button";
import { generateState } from "@/lib/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export default function Auth() {
  const params = useSearchParams();
  const status = params.get("status");

  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const redirectToLineAuth = async () => {
    const state = await generateState(10);

    const client_id = process.env.NEXT_PUBLIC_LINE_LOGIN_ID;
    const redirect_uri = process.env.NEXT_PUBLIC_LINE_REDIRECT_URI;

    if (client_id && redirect_uri) router.push(
      `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${client_id}&redirect_uri=${encodeURIComponent(redirect_uri)}&state=${state}&scope=profile%20openid`
    );
  };

  return (
    <main
      className="flex flex-col items-center"
    >
      {status === "error" && (
        <p className="text-red-500 font-medium p-4">ログインに問題が発生しました。再度お試しください。</p>
      )}
      <Button
        onClick={() => startTransition(redirectToLineAuth)}
        disabled={isPending}
      >
        LINEでログイン
      </Button>
    </main>
  );
}
