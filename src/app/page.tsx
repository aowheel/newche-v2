"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline">はじめる</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              東京科学大学サイクリング部ボール班のためのWEBアプリです。
            </AlertDialogTitle>
            <AlertDialogDescription>
              対象は部の関係者です。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              <Link href="https://www.titech.ac.jp/">キャンセル</Link>
            </AlertDialogCancel>
            <AlertDialogAction>
              <Link href="/auth">続ける</Link>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
