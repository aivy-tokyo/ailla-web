import "@/styles/globals.css";
import { backgroundImagePathAtom, clientInfoAtom } from "@/utils/atoms";
import { useAtomValue, useSetAtom } from "jotai";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

// sentry.init
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || "",
  environment: process.env.NEXT_PUBLIC_ENV || "", // prod, staging, dev
  release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || "no name",
  debug: process.env.NEXT_PUBLIC_ENV !== "prod",
});

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const backgroundImagePath = useAtomValue(backgroundImagePathAtom);

  // Sentry.setUserにユーザー情報を追加する
  useEffect(() => {
    if (session) {
      Sentry.setUser({
        id: session.user.id,
        username: session.user.name,
      });
    }
  }, [session]);

  useEffect(() => {
    window.scrollTo(0, 1);
  }, []);

  return (
    <SessionProvider session={session}>
      <div
        className="w-screen h-screen"
        style={{
          backgroundImage: `url("${backgroundImagePath}")`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  );
}
