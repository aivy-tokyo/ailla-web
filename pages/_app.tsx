import "@/styles/globals.css";
import { backgroundImagePathAtom } from "@/utils/atoms";
import { useAtomValue } from "jotai";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react"

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const backgroundImagePath = useAtomValue(backgroundImagePathAtom);

  return (
    <SessionProvider session={session}>
    <div
      className="w-screen h-screen fixed top-0"
      style={{
        backgroundImage: `url("${backgroundImagePath}")`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Component {...pageProps} />
    </div>
    </SessionProvider>
  );
}
