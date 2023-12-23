import { SecretFriend } from "~/components/secret-friend";
import Nieve from "./nieve";
import Link from "next/link";

export const runtime = "edge";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#123a4d] to-[#15162c] text-white">
      <Nieve />
      <div className="container flex flex-col  items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="font-serif text-5xl font-bold tracking-tight sm:text-[5rem]">
          Tu <span className="text-[hsl(195,100%,70%)]">A</span>migo{" "}
          <span className="text-[hsl(195,100%,70%)]">S</span>ecreto
        </h1>
        <SecretFriend />
      </div>
      <p className="my-8 text-sm text-white">
        Made with ❤️ by{" "}
        <Link className="underline" href="https://x.com/ruslangonzalez">
          Ruslan
        </Link>
      </p>
    </main>
  );
}
