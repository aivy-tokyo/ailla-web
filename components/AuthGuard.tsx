import axios from "axios";
import { useAtom, useSetAtom } from "jotai";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { PropsWithChildren, useEffect, useState } from "react";
import { clientInfoAtom, userIdAtom, userInfoAtom } from "../utils/atoms";
import { fetchUserId } from "../features/fetchUserId";
import * as Sentry from "@sentry/nextjs";
import { UserInfo } from "@/entities/UserInfo";
import { LanguageKey } from "@/utils/constants";

type ClientEnvValue = {
  formalLanguage: "en-US" | "zh-CN";
  learningLanguage: "中国語" | "英語";
  speakLanguage: "北京語" | "英語";
};

const clientEnv: Record<LanguageKey, ClientEnvValue> = {
  en: {
    formalLanguage: "en-US",
    learningLanguage: "英語",
    speakLanguage: "英語",
  },
  cn: {
    formalLanguage: "zh-CN",
    learningLanguage: "中国語",
    speakLanguage: "北京語",
  },
};

export const AuthGuard: React.FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const session = useSession();
  const [userId, setUserId] = useAtom(userIdAtom);
  const setUserInfo = useSetAtom(userInfoAtom);
  const setClientInfo = useSetAtom(clientInfoAtom);
  const [canShowContents, setCanShowContents] = useState<boolean>(false);

  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (session?.status === "unauthenticated") {
      timerId = setTimeout(() => {
        router.push("/login");
      }, 1000);
    } else {
      fetchUserId()
        .then((userId) => {
          setUserId(userId);
        })
        .catch((error) => {
          Sentry.captureException(error);
        });
    }

    return () => {
      clearTimeout(timerId);
    };
  }, [router, session, setUserId]);

  useEffect(() => {
    if (!userId) {
      return;
    }

    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/user?id=${userId}`);

        if (!response.data.name) {
          console.log("ユーザー情報がないので登録画面に遷移します");
          router.push("/register");
          return;
        }

        setCanShowContents(true);

        const userInfo: UserInfo = {
          name: response.data.name.S,
          prefecture: response.data.prefecture.S,
          birthdate: response.data.birthdate.S,
          gender: response.data.gender.S,
        };
        setUserInfo(userInfo);

        console.log("クライアント情報を取得します");

        const client = await axios.get(`/api/client`);

        if (!client.data) {
          console.log("クライアント情報がないので登録画面に遷移します");
          router.push("/register");
          return;
        }

        const languageKey = client.data.language.S as LanguageKey;

        const clientInfo = {
          language: languageKey,
          formalLanguage: clientEnv[languageKey].formalLanguage,
          speakLanguage: clientEnv[languageKey].speakLanguage,
          learningLanguage: clientEnv[languageKey].learningLanguage,
          situationList: client.data.situations.SS,
          speechApiKey: "",
          speechEndpoint: "",
        };

        setClientInfo(clientInfo);
      } catch (error) {
        Sentry.captureException(error);
      }
    };

    fetchData();
  }, [router, setUserInfo, userId]);

  if (!canShowContents) {
    return <></>;
  }

  return <>{children}</>;
};
