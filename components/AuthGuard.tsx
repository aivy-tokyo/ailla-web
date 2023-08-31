import axios from "axios";
import { useAtom, useSetAtom } from "jotai";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { PropsWithChildren, useEffect, useState } from "react";
import { userIdAtom, userInfoAtom } from "../utils/atoms";
import { fetchUserId } from "../features/fetchUserId";
import { UserProfile } from "../utils/types";
import * as Sentry from "@sentry/nextjs";

export const AuthGuard: React.FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [userId, setUserId] = useAtom(userIdAtom);
  const setUserInfo = useSetAtom(userInfoAtom);
  const [canShowContents, setCanShowContents] = useState<boolean>(false);
  
  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (!session) {
      timerId = setTimeout(() => {
        router.push("/login");
      }, 1000);
    } else {
      fetchUserId().then((userId) => {
        setUserId(userId);
      }).catch((error) => {
        Sentry.captureException(error);
      });
    }

    return () => {
      clearTimeout(timerId);
    }
  }, [router, session, setUserId]);

  useEffect(() => {
    if (!userId) {
      return;
    }
    axios
      .get(`/api/user?id=${userId}`)
      .then((response) => {
        if (!response.data.userName) {
          router.push("/register");
          return;
        }

        setCanShowContents(true);
        // TODO: ユーザー情報周りをリファクタリングしたら、ここは消す
        const profile = response.data as UserProfile;
        setUserInfo({
          name: profile.userName.S,
          prefecture: profile.userPrefecture.S,
          birthdate: profile.userBirthday.S,
          gender: profile.userGender.S,
        });
      })
      .catch((error) => {
        Sentry.captureException(error);
      });
  }, [router, userId]);

  if (!canShowContents) {
    return <></>;
  }

  return <>{children}</>;
};
