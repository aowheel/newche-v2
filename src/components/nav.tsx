"use client";

import clsx from "clsx";
import { Ellipsis } from "lucide-react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import Link from "next/link";

export default function Navi() {
  const router = useRouter();
  const path = usePathname();
  const [isPending, startTransition] = useTransition();

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
            className={clsx("rounded-full px-4 py-2 transition", {
              "bg-slate-900 text-white": path.startsWith("/attendance"),
              "bg-opacity-75": isPending
            })}
            disabled={isPending}
          >
            出欠席
          </button>
        </li>
        <li>
          <button
            onClick={() => startTransition(() => router.push("/manage"))}
            className={clsx("rounded-full px-4 py-2 transition", {
              "bg-slate-900 text-white": path.startsWith("/manage"),
              "bg-opacity-75": isPending
            })}
            disabled={isPending}
          >
            新規・編集
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
                <div className="flex flex-col">
                  <Link
                    href="/auth"
                    className="font-semibold"
                  >再ログイン</Link>
                  <span
                    className="px-2 text-sm text-slate-400"
                  >LINEのプロフィールを変更した場合など</span>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </li>
      </ul>
    </nav>
  );
}