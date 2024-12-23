"use server";

import { messagingApi } from "@line/bot-sdk";
import {
  countPresentOrLate,
  group,
  late,
  present,
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
          uri: "https://newche-v2.vercel.app"
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
            uri: "https://newche-v2.vercel.app"
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
    clipboardText += `${_date}${_start ? ` ${_start}` : ""}${(_start || _end) ? " -" : ""}${_end ? ` ${_end}` : ""}${description ? ` ${description}` : ""}\n`;
  });

  const ids = await group();
  const client = await BotClient();
  await Promise.all(
    ids.map(async ({ id }) => {
      await client.pushMessage({
        to: id,
        messages: [
          {
            type: "template",
            altText: "新しい日程が作成されました✨",
            template: {
              type: "buttons",
              text: "新しい日程が作成されました✨\n記入をお願いします🙇",
              actions: [
                {
                  type: "uri",
                  label: "出欠席の選択",
                  uri: "https://newche-v2.vercel.app/attendance"
                },
                {
                  type: "clipboard",
                  label: "日程をコピー",
                  clipboardText
                }
              ]
            }
          },
          {
            type: "textV2",
            text: clipboardText
          }
        ]
      });
    })
  );
}

export async function notifyUpdatedSchedule(schedule: ScheduleWithId[]) {
  let clipboardText = "";
  schedule.forEach(({ date, start, end, description }) => {
    const _date = formatInTimeZone(date, "Asia/Tokyo", "MM/dd (eee)", { locale: ja });
    const _start = start ? formatInTimeZone(start, "Asia/Tokyo", "HH:mm") : undefined;
    const _end = end ? formatInTimeZone(end, "Asia/Tokyo", "HH:mm") : undefined;
    clipboardText += `${_date}${_start ? ` ${_start}` : ""}${(_start || _end) ? " -" : ""}${_end ? ` ${_end}` : ""}${description ? ` ${description}` : ""}\n`;
  });

  const ids = await group();
  const client = await BotClient();
  await Promise.all(
    ids.map(async ({ id }) => {
      await client.pushMessage({
        to: id,
        messages: [
          {
            type: "template",
            altText: "日程が更新されました🛠️",
            template: {
              type: "buttons",
              text: "日程が更新されました🛠️\n確認をお願いします🙇",
              actions: [
                {
                  type: "uri",
                  label: "出欠席の選択",
                  uri: "https://newche-v2.vercel.app/attendance"
                },
                {
                  type: "clipboard",
                  label: "日程をコピー",
                  clipboardText
                }
              ]
            }
          },
          {
            type: "textV2",
            text: clipboardText
          }
        ]
      });
    })
  );
}

export async function notifyAt20() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const value = formatInTimeZone(tomorrow, "Asia/Tokyo", "yyyy-MM-dd");
  const tomorrowStart = new Date(value + "T00:00+09:00");

  const schedule = await scheduleOnDate(tomorrowStart);
  if (schedule.length === 1) {
    const { id, start, end, description } = schedule[0];

    const _start = start ? formatInTimeZone(start, "Asia/Tokyo", "HH:mm") : undefined;
    const _end = end ? formatInTimeZone(end, "Asia/Tokyo", "HH:mm") : undefined;

    const [count, presents, lates, undecideds] = await Promise.all([
      countPresentOrLate(id),
      present(id),
      late(id),
      undecided(id)
    ]);

    const ids = await group();
    const client = await BotClient();
    await Promise.all(
      ids.map(async ({ id: groupId }) => {
        const validPresents = (
          await Promise.all(
            presents.map(async ({ userId }) => {
              const { httpResponse } = await client.getGroupMemberProfileWithHttpInfo(groupId, userId);
              if (httpResponse.status === 200) {
                return userId;
              }
              return null;
            })
          )
        ).filter(userId => userId !== null);
        const validLates = (
          await Promise.all(
            lates.map(async ({ userId }) => {
              const { httpResponse } = await client.getGroupMemberProfileWithHttpInfo(groupId, userId);
              if (httpResponse.status === 200) {
                return userId;
              }
              return null;
            })
          )
        ).filter(userId => userId !== null);
        const validUndecideds = (
          await Promise.all(
            undecideds.map(async ({ userId }) => {
              const { httpResponse } = await client.getGroupMemberProfileWithHttpInfo(groupId, userId);
              if (httpResponse.status === 200) {
                return userId;
              }
              return null;
            })
          )
        ).filter(userId => userId !== null);

        let text = "明日の日程はこちらです📅\n\n";
        text += `${_start ? `${_start}` : ""}${(_start || _end) ? " - " : ""}${_end ? `${_end}` : ""}${description ? ` ${description}` : ""}\n\n`;
        text += `現時点での参加予定人数は ${count}人 です。`;

        const substitution: { [key: string]: any } = {};

        if (validPresents.length > 0) {
          text += "\n\n出席: ";
          validPresents.forEach((userId, idx) => {
            text += `{present${idx}} `;
            substitution[`present${idx}`] = {
              type: "mention",
              mentionee: {
                type: "user",
                userId
              }
            };
          });
        }
        if (validLates.length > 0) {
          text += "\n\n遅刻: ";
          validLates.forEach((userId, idx) => {
            text += `{late${idx}} `;
            substitution[`late${idx}`] = {
              type: "mention",
              mentionee: {
                type: "user",
                userId
              }
            };
          });
        }
        if (validUndecideds.length > 0) {
          text += "\n\n未定: ";
          validUndecideds.forEach((userId, idx) => {
            text += `{undecoded${idx}} `;
            substitution[`undecided${idx}`] = {
              type: "mention",
              mentionee: {
                type: "user",
                userId
              }
            };
          });
        }

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
              altText: "未定の方や変更がある場合はこちらから👇",
              template: {
                type: "buttons",
                text: "未定の方や変更がある場合はこちらから👇",
                actions: [
                  {
                    type: "uri",
                    label: "出欠席の選択",
                    uri: "https://newche-v2.vercel.app/attendance"
                  },
                  {
                    type: "uri",
                    label: "日程の一覧",
                    uri: `https://newche-v2.vercel.app/view?date=${value}`
                  }
                ]
              }
            }
          ]
        });
      })
    );
  } else if (schedule.length > 1) {
    let text = "明日の日程はこちらです📅\n\n";
    schedule.forEach(({ start, end, description }) => {
      const _start = start ? formatInTimeZone(start, "Asia/Tokyo", "HH:mm") : undefined;
      const _end = end ? formatInTimeZone(end, "Asia/Tokyo", "HH:mm") : undefined;

      text += `${_start ? ` ${_start}` : ""}${(_start || _end) ? " - " : ""}${_end ? `${_end}` : ""}${description ? ` ${description}` : ""}\n\n`;
    });
    text += "変更がある場合や参加者の確認はこちらから👇";

    const ids = await group();
    const client = await BotClient();
    await Promise.all(
      ids.map(async ({ id }) => {
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
                  label: "出欠席の選択",
                  uri: "https://newche-v2.vercel.app/attendance"
                },
                {
                  type: "uri",
                  label: "日程の一覧",
                  uri: `https://newche-v2.vercel.app/view?date=${value}`
                }
              ]
            }
          }]
        });
      })
    );
  }
}

export async function groupDetail() {
  const ids = await group();
  const client = await BotClient();
  return  Promise.all(
    ids.map(async ({ id }) => {
    const { groupName, pictureUrl } = await client.getGroupSummary(id);
    return { groupName, pictureUrl };
    })
  );
}

export async function botStatus() {
  const client = await BotClient();
  const quota = await client.getMessageQuota();
  const consumption = await client.getMessageQuotaConsumption();
  return { quota, consumption };
}
