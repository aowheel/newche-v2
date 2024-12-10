import { FriendGuide } from "@/components/guide";
import { botStatus, groupDetail } from "@/lib/bot";
import Link from "next/link";

export default async function Friend() {
  const details = await groupDetail();
  const { quota, consumption } = await botStatus();

  return (
    <>
      <FriendGuide details={details} status={`${consumption.totalUsage} / ${quota.value}`} />
      <Link
        href="https://line.me/R/ti/p/@747qtvue"
        className="px-4 py-2 rounded-full bg-slate-900 text-white transition hover:bg-opacity-75"
      >友だち追加</Link>
    </>
  );
}
