import "@/styles/globals.css";
import { backgroundImagePathAtom } from "@/utils/atoms";
import { useAtomValue } from "jotai";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react"
import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const backgroundImagePath = useAtomValue(backgroundImagePathAtom);

  // sentry.init
  const environment = {
    env: process.env.NEXT_PUBLIC_ENV || "dev",
    sentry: {
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || "",
    },
  };

  Sentry.init({
    dsn: environment.env !== 'dev' ? environment.sentry.dsn : '',
    environment: environment.env, // prod, staging, dev
    release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || 'no name',
    debug: environment.env !== 'prod',
  });

  // Sentry.setUserにユーザー情報を追加する
  useEffect(() => {
    if (session) {
      Sentry.setUser({
        id: session.user.id,
        username: session.user.name,
      });
    }
  } , [session]);

  useEffect(() => {
    window.scrollTo(0, 1);
  }, []);

  return (
    <SessionProvider session={session}>
    <div
      className="w-screen h-screen fixed top-0"
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
