import { notifyAt20 } from "@/lib/bot";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  console.log("Cron job started");

  await notifyAt20();

  return new Response(null, { status: 200 });
}
