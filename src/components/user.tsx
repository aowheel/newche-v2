import { session } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { redirect } from "next/navigation";

export default async function User() {
  const { name, picture } = await session();
  if (!name) return redirect("/login");

  return (
    <Avatar>
      <AvatarImage src={picture} alt="avatar" />
      <AvatarFallback>{name.charAt(0)}</AvatarFallback>
    </Avatar>
  );
}
