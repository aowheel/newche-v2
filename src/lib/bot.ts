"use server";

import { messagingApi } from '@line/bot-sdk';
import { group, Schedule, ScheduleWithId } from './data';
import { formatInTimeZone } from 'date-fns-tz';
import { ja } from 'date-fns/locale';
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

export async function BotClient() {
  const channelAccessToken = await token();
  return new MessagingApiClient({ channelAccessToken });
}

export async function notifyCreatedSchedule(schedule: Schedule[]) {
  let newMessage = "";
  schedule.forEach(({ date, start, end, description }) => {
    const _date = formatInTimeZone(date, "Asia/Tokyo", "MM/dd (eee)",  { locale: ja });
    const _start = start ? formatInTimeZone(start, "Asia/Tokyo", "HH:mm") : undefined;
    const _end = end ? formatInTimeZone(end, "Asia/Tokyo", "HH:mm") : undefined;
    newMessage += `${_date}${_start ? ` ${_start}` : ""}${(_start || _end) ? " - " : ""}${_end ? `${_end}` : ""}${description ? ` ${description}` : ""}\n`;
  });
  newMessage += "\n記入をお願いします🙇";

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
          text: newMessage,
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

export async function notifyUpdatedSchedule(schedule: ScheduleWithId[]) {
  let newMessage = "";
  schedule.forEach(({ date, start, end, description }) => {
    const _date = formatInTimeZone(date, "Asia/Tokyo", "MM/dd (eee)", { locale: ja });
    const _start = start ? formatInTimeZone(start, "Asia/Tokyo", "HH:mm") : undefined;
    const _end = end ? formatInTimeZone(end, "Asia/Tokyo", "HH:mm") : undefined;
    newMessage += `${_date}${_start ? ` ${_start}` : ""}${(_start || _end) ? " - " : ""}${_end ? `${_end}` : ""}${description ? ` ${description}` : ""}\n`;
  });
  newMessage += "\n記入をお願いします🙇";

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
          text: newMessage,
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
