import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { session } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const { name } = await session();
  if (name) return redirect("/view");

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
              <Link
                href="https://www.titech.ac.jp/"
                className="grow"
              >キャンセル</Link>
            </AlertDialogCancel>
            <AlertDialogAction>
              <Link 
                href="/auth"
                className="grow"
              >続ける</Link>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
