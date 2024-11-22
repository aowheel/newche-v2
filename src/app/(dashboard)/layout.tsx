import Nav from "@/components/nav";
import User from "@/components/user";
import { ReactNode } from "react";

export default function DashboardLayout({
  children
}: {
  children: ReactNode
}) {
  return (
    <>
      <header
        className="w-full flex items-center justify-between p-4"
      >
        <Nav />
        <User />
      </header>
      <main
        className="grow w-full flex flex-col items-center justify-center"
      >
        {children}
      </main>
    </>
  )
}