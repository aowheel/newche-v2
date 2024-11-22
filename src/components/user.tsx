import { session } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default async function User() {
  const { name, picture } = await session();

  if (!name) return redirect("/auth");

  return (
    <Avatar>
      <AvatarImage src={picture} alt="avatar" />
      <AvatarFallback>{session.name.charAt(0)}</AvatarFallback>
    </Avatar>
  );
}