import { follow, join, memberJoined } from "@/lib/bot";
import { upsertGroup } from "@/lib/data";
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

  const { events } = await JSON.parse(body);

  for (const event of events) {
    if (event.type === "follow") {
      await follow(event.replyToken);
    } else if (event.type === "join") {
      if (event.source.type === "group") {
        await upsertGroup(event.source.groupId);
        await join(event.replyToken);
      }
    } else if (event.type === "memberJoined") {
      if (event.source.type === "group") {
        await memberJoined(event.replyToken, event.joined.members);
      }
    }
  }

  return new Response(null, { status: 200 });
}
