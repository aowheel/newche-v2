import { FriendGuide } from "@/components/guide";
import Link from "next/link";

export default function Friend() {
  return (
    <>
      <FriendGuide />
      <Link
        href="https://line.me/R/ti/p/@747qtvue"
        className="px-4 py-2 rounded-full bg-slate-900 text-white transition hover:bg-opacity-75"
      >友だち追加</Link>
    </>
  );
}