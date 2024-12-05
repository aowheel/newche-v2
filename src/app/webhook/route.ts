import { BotClient } from "@/lib/bot";
import { upsertGroup } from "@/lib/data";
import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const received = req.headers.get("x-line-signature");

  const client_secret = process.env.LINE_BOT_SECRET || "";
  const body = await req.text();
  const generated = crypto
    .createHmac("SHA256", client_secret)
    .update(body)
    .digest("base64");

  if (received !== generated) {
    return new NextResponse("Invalid signature", { status: 400 });
  }

  const { events } = await JSON.parse(body);

  for (const event of events) {
    if (event.type === "follow") {
      const client = await BotClient();
      await client.replyMessage({
        replyToken: event.replyToken,
        messages: [{
          type: "text",
          text: "友だち追加ありがとうございます🙇\n\nNewcheはグループトーク専用のBotです。グループへ招待して利用を開始します🎈"
        }]
      });
    } else if (event.type === "join") {
      if (event.source.type === "group") {
        await upsertGroup(event.source.groupId);

        const client = await BotClient();
        await client.replyMessage({
          replyToken: event.replyToken,
          messages: [{
            type: "template",
            altText: "グループへの招待ありがとうございます🙇",
            template: {
              type: "buttons",
              text: "グループへの招待ありがとうございます🙇\nNewcheはスケジュール管理に役立つBotです🤖\n\nログインすることで日程の確認と参加可否の提出ができます🎈",
              actions: [{
                type: "uri",
                label: "はじめる",
                uri: "https://newche-v2.vercel.app/auth"
              }]
            }
          }]
        });
      }
    } else if (event.type === "memberJoined") {
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
        welcomeMessage += "さん、ようこそ🎉\nNewcheはスケジュール管理に役立つBotです🤖";

        const client = await BotClient();
        await client.replyMessage({
          replyToken: event.replyToken,
          messages: [
            {
              type: "textV2",
              text: welcomeMessage,
              substitution
            },
            {
              type: "template",
              altText: "ログインすることで日程の確認と参加可否の提出ができます🎈",
              template: {
                type: "buttons",
                text: "ログインすることで日程の確認と参加可否の提出ができます🎈",
                actions: [{
                  type: "uri",
                  label: "はじめる",
                  uri: "https://newche-v2.vercel.app/auth"
                }]
              }
            }
          ]
        });
      }
    }
  }

  return new NextResponse("Success", { status: 200 });
}
