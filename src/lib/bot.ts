"use server";

import { messagingApi } from "@line/bot-sdk";
import {
  countPresentOrLate,
  group,
  Schedule,
  scheduleOnDate,
  ScheduleWithId,
  undecided
} from "./data";
import { formatInTimeZone } from "date-fns-tz";
import { ja } from "date-fns/locale";

const { MessagingApiClient } = messagingApi;

async function token() {
  const client_id = process.env.NEXT_PUBLIC_LINE_BOT_ID;
  const client_secret = process.env.LINE_BOT_SECRET;

  if (client_id && client_secret) {
    const res = await fetch("https://api.line.me/oauth2/v3/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id,
        client_secret,
      })
    });

    if (res.ok) {
      const { access_token } = await res.json();
      return access_token;
    }
  }
}

async function BotClient() {
  const channelAccessToken = await token();
  return new MessagingApiClient({ channelAccessToken });
}

export async function follow(replyToken: string) {
  const client = await BotClient();
  await client.replyMessage({
    replyToken,
    messages: [{
      type: "text",
      text: "友だち追加ありがとうございます🙇\n\nNewcheはグループトーク専用のBotです。グループへ招待して利用を開始します。"
    }]
  });
}

export async function join(replyToken: string) {
  const client = await BotClient();
  await client.replyMessage({
    replyToken,
    messages: [{
      type: "template",
      altText: "グループへの招待ありがとうございます🙇",
      template: {
        type: "buttons",
        text: "グループへの招待ありがとうございます🙇\nNewcheはスケジュール管理に役立つBotです。\n\nログインすることで日程の確認と参加可否の提出ができます。",
        actions: [{
          type: "uri",
          label: "はじめる",
          uri: "https://newche-v2.vercel.app/login"
        }]
      }
    }]
  });
}

export async function memberJoined(
  replyToken: string,
  members: any[]
) {
  let text = "";
  const substitution = {} as { [key: string]: any };
  members.forEach(({ userId }, idx) => {
    text += `{user${idx}} `;
    substitution[`user${idx}`] = {
      type: "mention",
      mentionee: {
        type: "user",
        userId
      }
    };
  });
  text += "さん、ようこそ🎉\nNewcheはスケジュール管理に役立つBotです。";

  const client = await BotClient();
  await client.replyMessage({
    replyToken,
    messages: [
      {
        type: "textV2",
        text,
        substitution
      },
      {
        type: "template",
        altText: "ログインすることで日程の確認と参加可否の提出ができます。",
        template: {
          type: "buttons",
          text: "ログインすることで日程の確認と参加可否の提出ができます。",
          actions: [{
            type: "uri",
            label: "はじめる",
            uri: "https://newche-v2.vercel.app/login"
          }]
        }
      }
    ]
  });
}

export async function notifyCreatedSchedule(schedule: Schedule[]) {
  let clipboardText = "";
  schedule.forEach(({ date, start, end, description }) => {
    const _date = formatInTimeZone(date, "Asia/Tokyo", "MM/dd (eee)",  { locale: ja });
    const _start = start ? formatInTimeZone(start, "Asia/Tokyo", "HH:mm") : undefined;
    const _end = end ? formatInTimeZone(end, "Asia/Tokyo", "HH:mm") : undefined;
    clipboardText += `${_date}${_start ? ` ${_start}` : ""}${(_start || _end) ? " - " : ""}${_end ? `${_end}` : ""}${description ? ` ${description}` : ""}\n`;
  });

  const text = clipboardText + "\n記入をお願いします🙇";

  const client = await BotClient();

  const ids = await group();
  ids.forEach(async ({ id }) => {
    await client.pushMessage({
      to: id,
      messages: [{
        type: "template",
        altText: "新しい日程が追加されました✨",
        template: {
          type: "buttons",
          title: "New ✨",
          text,
          actions: [
            {
              type: "uri",
              label: "記入する",
              uri: "https://newche-v2.vercel.app/attendance"
            },
            {
              type: "clipboard",
              label: "日程をコピー",
              clipboardText
            }
          ]
        }
      }]
    });
  });
}

export async function notifyUpdatedSchedule(schedule: ScheduleWithId[]) {
  let text = "";
  schedule.forEach(({ date, start, end, description }) => {
    const _date = formatInTimeZone(date, "Asia/Tokyo", "MM/dd (eee)", { locale: ja });
    const _start = start ? formatInTimeZone(start, "Asia/Tokyo", "HH:mm") : undefined;
    const _end = end ? formatInTimeZone(end, "Asia/Tokyo", "HH:mm") : undefined;
    text += `${_date}${_start ? ` ${_start}` : ""}${(_start || _end) ? " - " : ""}${_end ? `${_end}` : ""}${description ? ` ${description}` : ""}\n`;
  });
  text += "\n確認をお願いします🙇";

  const client = await BotClient();

  const ids = await group();
  ids.forEach(async ({ id }) => {
    await client.pushMessage({
      to: id,
      messages: [{
        type: "template",
        altText: "日程が更新されました🛠️",
        template: {
          type: "buttons",
          title: "Update 🛠️",
          text,
          actions: [{
            type: "uri",
            label: "記入する",
            uri: "https://newche-v2.vercel.app/attendance"
          }]
        }
      }]
    });
  });
}

export async function notifyAt20() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  let _tomorrowStart = formatInTimeZone(tomorrow, "Asia/Tokyo", "yyyy-MM-dd");
  _tomorrowStart += "T00:00+09:00";
  const tomorrowStart = new Date(_tomorrowStart);

  const schedule = await scheduleOnDate(tomorrowStart);
  if (schedule.length === 0) {
    return;
  } else if (schedule.length === 1) {
    const { id, start, end, description } = schedule[0];

    const _start = start ? formatInTimeZone(start, "Asia/Tokyo", "HH:mm") : undefined;
    const _end = end ? formatInTimeZone(end, "Asia/Tokyo", "HH:mm") : undefined;

    let text = "明日の日程はこちらです📅\n\n";
    text += `${_start ? `${_start}` : ""}${(_start || _end) ? " - " : ""}${_end ? `${_end}` : ""}${description ? ` ${description}` : ""}\n\n`;

    const count = await countPresentOrLate(id);
    text += `現時点での参加予定人数は ${count}人 です。\n\n`;

    const undecideds = await undecided(id);

    const client = await BotClient();

    const ids = await group();
    ids.forEach(async ({ id: groupId }) => {
      /* アカウント認証後こちらに移行
      const memberIds = await groupMemberIds(id);
      const mentions = undecideds.filter(({ userId }) => memberIds.includes(userId));

      const substitution = {} as { [key: string]: any };
      if (mentions.length > 0) {
        text += "未定の方: ";
        mentions.forEach(({ userId }, idx) => {
          text += `{user${idx}} `;
          substitution[`user${idx}`] = {
            type: "mention",
            mentionee: {
              type: "user",
              userId
            }
          };
        });
      };
      */
      // ここから
      const substitution = {} as { [key: string]: any };
      if (undecideds.length > 0) {
        text += "未定の方: ";
        undecideds.forEach(({ userId }, idx) => {
          text += `{user${idx}} `;
          substitution[`user${idx}`] = {
            type: "mention",
            mentionee: {
              type: "user",
              userId
            }
          };
        });
      };
      // ここまで

      await client.pushMessage({
        to: groupId,
        messages: [
          {
            type: "textV2",
            text,
            substitution
          },
          {
            type: "template",
            altText: "変更がある場合はこちらから👇",
            template: {
              type: "buttons",
              text: "変更がある場合はこちらから👇",
              actions: [
                {
                  type: "uri",
                  label: "変更",
                  uri: "https://newche-v2.vercel.app/attendance"
                },
                {
                  type: "uri",
                  label: "一覧はこちら",
                  uri: "https://newche-v2.vercel.app/view"
                }
              ]
            }
          }
        ]
      });
    });
  } else {
    let text = "明日の日程はこちらです📅\n\n";
    schedule.forEach(({ start, end, description }) => {
      const _start = start ? formatInTimeZone(start, "Asia/Tokyo", "HH:mm") : undefined;
      const _end = end ? formatInTimeZone(end, "Asia/Tokyo", "HH:mm") : undefined;

      text += `${_start ? ` ${_start}` : ""}${(_start || _end) ? " - " : ""}${_end ? `${_end}` : ""}${description ? ` ${description}` : ""}\n\n`;
    });
    text += "変更がある場合やそれぞれの参加者の確認はこちらから👇";

    const client = await BotClient();

    const ids = await group();
    ids.forEach(async ({ id }) => {
      await client.pushMessage({
        to: id,
        messages: [{
          type: "template",
          altText: "明日の日程はこちらです📅",
          template: {
            type: "buttons",
            text,
            actions: [
              {
                type: "uri",
                label: "変更",
                uri: "https://newche-v2.vercel.app/attendance"
              },
              {
                type: "uri",
                label: "一覧",
                uri: "https://newche-v2.vercel.app/view"
              }
            ]
          }
        }]
      });
    });
  }
}

export async function groupMemberIds(groupId: string) {
  const res = await fetch(`https://api.line.me/v2/bot/group/${groupId}/members/ids`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${await token()}` 
    }
  });

  if (res.ok) {
    const { memberIds } = await res.json();
    return memberIds;
  }
}
