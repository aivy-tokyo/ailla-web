import axios from "axios";
import { useAtom } from "jotai";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { PropsWithChildren, useEffect, useState } from "react";
import { userIdAtom } from "../utils/atoms";
import { fetchUserId } from "../features/fetchUserId";

export const AuthGuard: React.FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [userId, setUserId] = useAtom(userIdAtom);
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
        console.error("Error:", error);
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
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [router, userId]);

  if (!canShowContents) {
    return <></>;
  }

  return <>{children}</>;
};
