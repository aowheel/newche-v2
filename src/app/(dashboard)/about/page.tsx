import Image from "next/image";
import Link from "next/link";

export default function About() {
  return (
    <Link
      href="https://github.com/aowheel/newche-v2"
      className="transition hover:opacity-75"
    >
      <Image
        src="/github.png"
        alt="github"
        width={32}
        height={32}
      />
    </Link>
  );
}
