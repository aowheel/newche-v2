import { session } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default async function User() {
  const { name, picture } = await session();

  return (
    <Avatar>
      <AvatarImage src={picture} alt="avatar" />
      <AvatarFallback>{name.charAt(0)}</AvatarFallback>
    </Avatar>
  );
}