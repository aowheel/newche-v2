"use client";

import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { unsubmitted } from "@/lib/data";

export default function Navigator() {
  const router = useRouter();

  const path = usePathname();
  const isAttendancePath = path.startsWith("/attendance");

  const [isPending, startTransition] = useTransition();

  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchUnsubmitted = async () => {
      setCount(await unsubmitted());
    };

    fetchUnsubmitted();
  }, [isAttendancePath]);

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
              <div className="flex items-end rounded-full px-4 py-2 hover:bg-slate-100 transition">
                その他
                <ChevronDown className="w-5 h-5" />
              </div>
            </PopoverTrigger>
            <PopoverContent>
              <div className="flex flex-col gap-y-1 text-slate-600">
                <button
                  className="flex flex-col p-1 rounded hover:bg-slate-100 outline-none"
                  onClick={() => startTransition(() => router.push("/manage"))}
                  disabled={isPending}
                >
                  <span
                    className="font-semibold"
                  >新規・編集</span>
                  <span
                    className="px-1 text-sm text-slate-400"
                  >新しい日程の作成と既存の日程の編集</span>
                </button>
                <button
                  className="flex flex-col p-1 rounded hover:bg-slate-100 outline-none"
                  onClick={() => startTransition(() => router.push("/login"))}
                  disabled={isPending}
                >
                  <span
                    className="font-semibold"
                  >再ログイン</span>
                  <span
                    className="px-1 text-sm text-slate-400"
                  >LINEのプロフィールを変更した場合</span>
                </button>
                <button
                  className="flex flex-col p-1 rounded hover:bg-slate-100 outline-none"
                  onClick={() => startTransition(() => router.push("/friend"))}
                  disabled={isPending}
                >
                  <span
                    className="font-semibold"
                  >友だち追加</span>
                  <span
                    className="px-1 text-sm text-slate-400"
                  >Botを別のグループトークで利用</span>
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </li>
      </ul>
    </nav>
  );
}