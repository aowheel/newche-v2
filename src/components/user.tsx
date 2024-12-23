import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default async function User({ name, picture }: {
  name: string;
  picture: string | undefined;
}) {
  return (
    <Avatar>
      <AvatarImage src={picture} alt="avatar" />
      <AvatarFallback>{name.charAt(0)}</AvatarFallback>
    </Avatar>
  );
}
