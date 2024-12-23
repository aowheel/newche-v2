"use client";

import clsx from "clsx";
import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { unsubmitted } from "@/lib/data";

export default function Navigator({ sub }: { sub: string }) {
  const router = useRouter();

  const path = usePathname();
  const isAttendancePath = path.startsWith("/attendance");

  const [isPending, startTransition] = useTransition();

  const [count, setCount] = useState(0);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchUnsubmitted = async () => {
      setCount(await unsubmitted(sub));
    };

    fetchUnsubmitted();
  }, [sub, isAttendancePath]);

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
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <div className={clsx("group flex items-end rounded-full px-4 py-2 transition", {
                "hover:bg-slate-100": path.startsWith("/view") || path.startsWith("/attendance"),
                "bg-slate-900 text-white": !path.startsWith("/view") && !path.startsWith("/attendance"),
                "bg-opacity-75": isPending
              })}>
                その他
                <ChevronRight className="w-5 h-5 group-hover:rotate-90 transition" />
              </div>
            </PopoverTrigger>
            <PopoverContent>
              <button
                className="w-full flex flex-col p-1 rounded hover:bg-slate-100 outline-none"
                onClick={() => startTransition(() => {
                  router.push("/manage");
                  setOpen(false);
                })}
                disabled={isPending}
              >
                <span
                  className="font-semibold text-slate-600"
                >新規・編集</span>
                <span
                  className="px-1 text-sm text-slate-400"
                >新しい日程の作成と既存の日程の編集</span>
              </button>
              <button
                className="w-full flex flex-col p-1 rounded hover:bg-slate-100 outline-none"
                onClick={() => startTransition(() => {
                  router.push("/login?status=re");
                  setOpen(false);
                })}
                disabled={isPending}
              >
                <span
                  className="font-semibold text-slate-600"
                >再ログイン</span>
                <span
                  className="px-1 text-sm text-slate-400"
                >LINEのプロフィールを変更した場合</span>
              </button>
              <button
                className="w-full flex flex-col p-1 rounded hover:bg-slate-100 outline-none"
                onClick={() => startTransition(() => {
                  router.push("/friend");
                  setOpen(false);
                })}
                disabled={isPending}
              >
                <span
                  className="font-semibold text-slate-600"
                >友だち追加</span>
                <span
                  className="px-1 text-sm text-slate-400"
                >Botを別のグループトークで利用</span>
              </button>
              <button
                className="w-full flex flex-col p-1 rounded hover:bg-slate-100 outline-none"
                onClick={() => startTransition(() => {
                  router.push("/about");
                  setOpen(false);
                })}
                disabled={isPending}
              >
                <span
                  className="font-semibold text-slate-600"
                >概要</span>
              </button>
            </PopoverContent>
          </Popover>
        </li>
      </ul>
    </nav>
  );
}
