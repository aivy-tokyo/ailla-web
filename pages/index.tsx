import { useAtomValue } from "jotai";
import { userIdAtom } from "../utils/atoms";
import { AppHead } from "../components/AppHead";
import VrmViewer from "../components/VrmViewer";
import { UiContainer } from "@/components/UiContainer";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import axios from "axios";

export default function Home() {
  // session取得、ログインしていない場合はlogin.tsxへリダイレクト
  const router = useRouter();
  const { data: session } = useSession();
  // useEffect(() => {
  //   if (!session) {
  //     router.push("/login");
  //   }
  // }, [router, session]);

  // User情報を取得、未登録の場合はregister.tsxへリダイレクト
  const userId = useAtomValue(userIdAtom);
  useEffect(() => {
    axios
      .get(`/api/user?id=${userId}`)
      .then((response) => {
        console.log("response", response.data);
        // userNameが空の場合はregister.tsxへリダイレクト
        if (!response.data.userName) {
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
