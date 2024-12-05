"use server";

import { messagingApi } from '@line/bot-sdk';
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

export async function createSchedule() {}
