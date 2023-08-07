import { Inter } from "next/font/google";
import { useAtom, useAtomValue } from "jotai";
import { chatProcessingAtom, userIdAtom } from "../utils/atoms";
import { AppHead } from "../components/AppHead";
import VrmViewer from "../components/VrmViewer";
import { UiContainer } from "@/components/UiContainer";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import axios from "axios";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const chatProcessing = useAtomValue(chatProcessingAtom);

  // session取得、ログインしていない場合はlogin.tsxへリダイレクト
  const router = useRouter();
  const { data: session } = useSession();
  useEffect(() => {
    if (!session) {
      router.push("/login");
    }
  }, [router, session]);

  // User情報を取得、未登録の場合はregister.tsxへリダイレクト
  const [userId, setUserId] = useAtom(userIdAtom);
  useEffect(() => {
    axios
      .get(`/api/user?id=${userId}`)
      .then((response) => {
        console.log("response", response.data);
        // userNameが空の場合はregister.tsxへリダイレクト
        if (!response.data.userName) {
          // ユーザーIDを新しくしてしまっているのでそれをやめる
          // 上記対応になっている？
          setUserId(userId);
          router.push("/register");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [router, userId]);

  return (
    <>
      <AppHead />
      <VrmViewer />
      <UiContainer />
    </>
  );
}
