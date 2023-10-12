import "@/styles/globals.css";
import { backgroundImagePathAtom, clientInfoAtom } from "@/utils/atoms";
import { useAtomValue, useSetAtom } from "jotai";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { ClientInfo } from "@/entities/ClientInfo";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const backgroundImagePath = useAtomValue(backgroundImagePathAtom);
  const setClientInfo = useSetAtom(clientInfoAtom);

  // sentry.init
  const environment = {
    env: process.env.NEXT_PUBLIC_ENV || "dev",
    sentry: {
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || "",
    },
  };

  Sentry.init({
    dsn: environment.env !== "dev" ? environment.sentry.dsn : "",
    environment: environment.env, // prod, staging, dev
    release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || "no name",
    debug: environment.env !== "prod",
  });

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

  // クライアントごとに設定されたドメインでコンテンツ等を振りわける
  const router = useRouter();
  // const hostname = router.asPath.split(".")[0];
  // TODO: ドメインをURLから取得する 一旦決め打ち
  const code: string = "2";
  useEffect(() => {
    if (code === "ailla" || code === "/") {
      return;
    }
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/client?id=${code}`);
        console.log("client response->", response);
        const data = response.data;
        if (data) {
          const clientInfo: ClientInfo = {
            language: data.language.S,
            situationList: data.situations.SS,
            speechApiKey: "",
            speechEndpoint: "",
          };
          setClientInfo(clientInfo);

          console.log("clientInfo->", clientInfo);
        }
      } catch (error) {
        Sentry.captureException(error);
      }
    };
    fetchData();
  }, [code, setClientInfo]);

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
