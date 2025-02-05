import { notifyNextWeekSchedule } from "@/lib/bot";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  await notifyNextWeekSchedule();

  return new Response(null, { status: 200 });
}
