import "~/styles/globals.css";

import { Inter, Dancing_Script, Kalam } from "next/font/google";
import { cookies } from "next/headers";

import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});
const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-serif",
});
const kalam = Kalam({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-serif2",
});

export const metadata = {
  title: "Juego del amigo secreto!",
  description: "Con este juego podrás hacer el amigo secreto con tus amigos!",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`font-sans ${inter.variable} ${dancingScript.variable} ${kalam.variable}`}
      >
        <Toaster />
        <TRPCReactProvider cookies={cookies().toString()}>
          {children}
        </TRPCReactProvider>
      </body>
    </html>
  );
}
