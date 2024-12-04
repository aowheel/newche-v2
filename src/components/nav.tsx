"use client";

import clsx from "clsx";
import { Ellipsis } from "lucide-react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import Link from "next/link";
import { unsubmitted } from "@/lib/data";

export default function Navi() {
  const router = useRouter();
  const path = usePathname();
  const [isPending, startTransition] = useTransition();

  const [count, setCount] = useState(0);
  useEffect(() => {
    const fetchUnsubmitted = async () => {
      setCount(await unsubmitted());
    };
  
    fetchUnsubmitted();
  }, [path.startsWith("/attendance")]);

  return (
    <nav className="w-fit">
      <ul className="flex font-medium text-slate-900">
        <li>
          <button
            onClick={() => startTransition(() => router.push("/view"))}
            className={clsx("rounded-full px-4 py-2 transition", {
              "bg-slate-900 text-white": path.startsWith("/view"),
              "bg-opacity-75": isPending
            })}
            disabled={isPending}
          >
            一覧
          </button>
        </li>
        <li>
          <button
            onClick={() => startTransition(() => router.push("/attendance"))}
            className={clsx("relative rounded-full px-4 py-2 transition", {
              "bg-slate-900 text-white": path.startsWith("/attendance"),
              "bg-opacity-75": isPending
            })}
            disabled={isPending}
          >
            <span className={clsx({
              "border-b-2 border-orange-500": count > 0
            })}>出欠席</span>
            {count > 0 &&
            <span className="absolute -top-1 right-0 w-6 h-6 flex items-center justify-center rounded-full border-2 border-orange-500 bg-white font-medium text-orange-500">{count}</span>}
          </button>
        </li>
        <li>
          <Popover>
            <PopoverTrigger asChild>
              <div className="px-4 py-2">
                <Ellipsis />
              </div>
            </PopoverTrigger>
            <PopoverContent>
              <div className="flex flex-col gap-y-1 text-slate-600">
                <Link className="flex flex-col p-1 rounded hover:bg-slate-100" href="/manage">
                  <span
                    className="font-semibold"
                  >新規・編集</span>
                  <span
                    className="px-1 text-sm text-slate-400"
                  >新しい日程の作成と既存の日程の編集</span>
                </Link>
                <Link className="flex flex-col p-1 hover:bg-slate-100" href="/auth">
                  <span
                    className="font-semibold"
                  >再ログイン</span>
                  <span
                    className="px-1 text-sm text-slate-400"
                  >LINEのプロフィールを変更した場合など</span>
                </Link>
              </div>
            </PopoverContent>
          </Popover>
        </li>
      </ul>
    </nav>
  );
}