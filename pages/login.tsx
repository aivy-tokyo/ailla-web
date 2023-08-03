import { useAtom } from "jotai";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import { userIdAtom } from "../utils/atoms";

// /api/session/jwtからjwtを取得してidを返す関数
const fetchUserId = async () => {
  const res = await fetch("/api/session/jwt");
  const data = await res.json();
  console.log("data", data);

  return data.sub;
};

export default function ProtectedPage() {
  // session取得、ログインしている場合はindex.tsxへリダイレクト
  const router = useRouter();
  const { data: session } = useSession();
  const [, setUserId] = useAtom(userIdAtom);
  useEffect(() => {
    if (session) {
      // jwtを取得、userIdAtomにセット
      fetchUserId().then((userId) => {
        setUserId(userId);
        router.push("/");
      }).catch((error) => {
        console.error("Error:", error);
      });
    }
  }, [router, session]);

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
      <h1
        className="
        text-4xl font-bold
        text-center
      "
      >
        AILLA
      </h1>
      <p>
        AI英会話サービス「AILLA」へようこそ!LINEアカウントでログインしてサービスを開始しましょう!
      </p>
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
