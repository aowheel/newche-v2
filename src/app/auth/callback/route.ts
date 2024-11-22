import { ironSession, User } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;

  const code = params.get("code");
  const state = params.get("state");

  const storedState = req.cookies.get("state")?.value;

  if (code && state && storedState === state) {
    const redirect_uri = process.env.NEXT_PUBLIC_LINE_REDIRECT_URI;
    const client_id = process.env.NEXT_PUBLIC_LINE_CLIENT_ID;
    const client_secret = process.env.LINE_CLIENT_SECRET;

    if (redirect_uri && client_id && client_secret) {
      let res = await fetch("https://api.line.me/oauth2/v2.1/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          redirect_uri,
          client_id,
          client_secret,
        }),
      });

      if (res.ok) {
        const { access_token } = await res.json();

        res = await fetch("https://api.line.me/oauth2/v2.1/userinfo", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${access_token}`
          }
        });

        if (res.ok) {
          const { sub, name, picture } = await res.json() as User;

          await prisma.user.upsert({
            where: { sub },
            update: { name, picture },
            create: { sub, name, picture }
          });

          const session = await ironSession();
          session.sub = sub;
          session.name = name;
          session.picture = picture;

          await session.save();

          return redirect("/view");
        }
      }
    }
  }

  return redirect("/auth?status=error");
}