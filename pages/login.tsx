import { useAtom } from "jotai";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import { userIdAtom } from "../utils/atoms";
import { fetchUserId } from "../features/fetchUserId";
import * as Sentry from "@sentry/nextjs";

export default function LoginPage() {
  // session取得、ログインしている場合はindex.tsxへリダイレクト
  const router = useRouter();
  const { data: session } = useSession();
  const [, setUserId] = useAtom(userIdAtom);
  useEffect(() => {
    if (session) {
      // jwtを取得、userIdAtomにセット
      fetchUserId()
        .then((userId) => {
          setUserId(userId);
          router.push("/");
        })
        .catch((error) => {
          Sentry.captureException(error);
        });
    }
  }, [router, session, setUserId]);

  // useCallback: signin
  const signin = useCallback(() => {
    signIn("line");
  }, []);

  return (
    <div
      className="
      flex flex-col
      justify-center items-center
      w-screen h-screen
    "
    >
      <div className="text-white">
        <h1 className="text-4xl font-bold text-center">AILLA</h1>
        <p className="p-3 mx-auto text-center">
          AI英会話サービス「AILLA」へようこそ!
          <br />
          LINEアカウントでログインしてサービスを開始しましょう!
        </p>
      </div>
      <button
        className="
        bg-green-500 hover:bg-green-700
        text-white font-bold py-2 px-4 rounded
        mt-4
      "
        onClick={() => signin()}
      >
        LINEログイン
      </button>
    </div>
  );
}
