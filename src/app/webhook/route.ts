import { token } from "@/lib/bot";
import { upsertGroup } from "@/lib/data";
import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const client_secret = process.env.LINE_CLIENT_SECRET || "";
  const body = await req.text();
  const signature = crypto
    .createHmac("SHA256", client_secret)
    .update(body)
    .digest("base64");

  if (signature !== req.headers.get("X-Line-Signature")) {
    return new NextResponse("Invalid signature", { status: 400 });
  }

  const { events } = await req.json();

  for (const event of events) {
    if (event.type === "follow") {
      await fetch("https://api.line.me/v2/bot/message/reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${await token()}`
        },
        body: JSON.stringify({
          replyToken: event.replyToken,
          messages: [{
            type: "text",
            text: "友だち追加ありがとうございます🙇\n\nNewcheはグループトーク専用のBotです。グループへ招待することで利用を開始します🎈"
          }]
        })
      });
    }

    if (event.type === "join") {
      if (event.source.type === "group") {
        await upsertGroup(event.source.groupId);
        await fetch("https://api.line.me/v2/bot/message/reply", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${await token()}`
          },
          body: JSON.stringify({
            replyToken: event.replyToken,
            messages: [{
              type: "template",
              altText: "グループへの招待ありがとうございます🙇",
              template: {
                type: "buttons",
                text: "グループへの招待ありがとうございます🙇\nNewcheは日程管理のBotです🤖\n\nLINEでログインしてはじめます🔽",
                actions: [{
                  type: "uri",
                  label: "はじめる",
                  uri: "https://newche-v2.vercel.app/auth"
                }]
              }
            }]
          })
        });
      }
    }

    if (event.type === "memberJoined") {
      if (event.source.type === "group") {
        const members = event.joined.members as any[];

        let welcomeMessage = "";
        const substitution = {} as { [key: string]: any };
        members.forEach(({ userId }, idx) => {
          welcomeMessage += `{user${idx}} `;
          substitution[`user${idx}`] = {
            type: "mention",
            mentionee: {
              type: "user",
              userId
            }
          };
        });
        welcomeMessage += "さん、ようこそ🎉\nNewcheは日程管理のBotです🤖";

        await fetch("https://api.line.me/v2/bot/message/reply", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${await token()}`
          },
          body: JSON.stringify({
            replyToken: event.replyToken,
            messages: [
              {
                type: "textV2",
                text: welcomeMessage,
                substitution
              },
              {
                type: "template",
                altText: "LINEでログインしてはじめます🔽",
                template: {
                  type: "buttons",
                  text: "LINEでログインしてはじめます🔽",
                  actions: [{
                    type: "uri",
                    label: "はじめる",
                    uri: "https://newche-v2.vercel.app/auth"
                  }]
                }
              }
            ]
          })
        });
      }
    }
  }

  return new NextResponse("Success", { status: 200 });
}
