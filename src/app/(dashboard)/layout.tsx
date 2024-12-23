import Navigator from "@/components/navigator";
import User from "@/components/user";
import { session } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function DashboardLayout({
  children
}: {
  children: ReactNode
}) {
  const { sub, name, picture } = await session();
  if (!name) return redirect("/login");

  return (
    <>
      <header
        className="w-full flex items-center justify-between p-4"
      >
        <Navigator sub={sub} />
        <User name={name} picture={picture} />
      </header>
      <main
        className="grow w-full flex flex-col items-center justify-center"
      >
        {children}
      </main>
    </>
  )
}
