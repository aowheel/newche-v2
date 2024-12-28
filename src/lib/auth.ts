"use server";

import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";

export async function generateState(length: number) {
  const chars = "abcdefjhijklmnopqrstuvwxyz0123456789";

  let state = "";
  for (let i = 0; i < length; i++) {
    const idx = Math.floor(Math.random() * chars.length);
    state += chars[idx];
  }

  const cookieStore = await cookies();
  cookieStore.set("state", state);

  return state;
}

export interface User {
  sub: string;
  name: string,
  picture?: string;
}

const sessionOptions: SessionOptions = {
  password: process.env.IRON_SESSION_SECRET!,
  cookieName: "session",
  ttl: 60 * 60 * 24 * 365
}

export async function getSession() {
  const cookieStore = await cookies();

  return getIronSession<User>(cookieStore, sessionOptions);
}
