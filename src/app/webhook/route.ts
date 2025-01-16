import { follow, join, memberJoined, notifyNextWeekSchedule } from "@/lib/bot";
import { createGroup, deleteGroup } from "@/lib/data";
import { WebhookEvent } from "@line/bot-sdk";
import crypto from "crypto";

export async function POST(req: Request) {
  const received = req.headers.get("x-line-signature");

  const client_secret = process.env.LINE_BOT_SECRET || "";
  const body = await req.text();
  const generated = crypto
    .createHmac("SHA256", client_secret)
    .update(body)
    .digest("base64");

  if (received !== generated) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { events }: { events: WebhookEvent[] } = await JSON.parse(body);

  for (const event of events) {
    if (event.type === "follow") {
      await follow(event.replyToken);
    } else if (event.type === "join") {
      if (event.source.type === "group") {
        await createGroup(event.source.groupId);
        await join(event.replyToken);
      }
    } else if (event.type === "leave") {
      if (event.source.type === "group") {
        await deleteGroup(event.source.groupId);
      }
    } else if (event.type === "memberJoined") {
      if (event.source.type === "group") {
        await memberJoined(event.replyToken, event.joined.members);
      }
    } else if (event.type === "message") {
      if (
        event.source.type === "group"
          && event.message.type === "text"
          && event.message.mention?.mentionees.some((m: any) => m?.isSelf)
      ) {
        await notifyNextWeekSchedule(event.replyToken);
      }
    }
  }

  return new Response(null, { status: 200 });
}
