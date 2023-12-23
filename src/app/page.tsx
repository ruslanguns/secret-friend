import { SecretFriend } from "~/components/secret-friend";
import Nieve from "./nieve";

export const runtime = "edge";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#123a4d] to-[#15162c] text-white">
      <Nieve />
      <div className="container flex flex-col  items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="font-serif text-5xl font-bold tracking-tight sm:text-[5rem]">
          Amigo <span className="text-[hsl(195,100%,70%)]">S</span>ecreto
        </h1>
        <SecretFriend />
      </div>
    </main>
  );
}
