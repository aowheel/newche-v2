import Image from "next/image";
import Link from "next/link";

export default function About() {
  return (
    <div className="flex gap-x-16">
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
      <Link
        href="https://x.com/aowheel"
        className="transition hover:opacity-75"
      >
        <Image
          src="/x.png"
          alt="x"
          width={32}
          height={32}
        />
      </Link>
    </div>
  );
}
