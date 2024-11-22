"use client";

import clsx from "clsx";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

export default function Navi() {
  const router = useRouter();
  const path = usePathname();

  return (
    <nav className="w-fit">
      <ul className="flex font-medium text-slate-900">
        <li>
          <button
            onClick={() => router.push("/view")}
            className={clsx("rounded-full px-4 py-2 transition", {
              "bg-slate-900 text-white": path.startsWith("/view")
            })}
          >
            一覧
          </button>
        </li>
        <li>
          <button
            onClick={() => router.push("/attendance")}
            className={clsx("rounded-full px-4 py-2 transition", {
              "bg-slate-900 text-white": path.startsWith("/attendance")
            })}
          >
            出欠席
          </button>
        </li>
        <li>
          <button
            onClick={() => router.push("/manage")}
            className={clsx("rounded-full px-4 py-2 transition", {
              "bg-slate-900 text-white": path.startsWith("/manage")
            })}
          >
            新規・編集
          </button>
        </li>
      </ul>
    </nav>
  );
}