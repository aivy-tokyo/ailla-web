import Image  from "next/image"
import { useAtom } from "jotai";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import { userIdAtom } from "../utils/atoms";
import { fetchUserId } from "../features/fetchUserId";
import * as Sentry from "@sentry/nextjs";
import { AppHead } from "../components/AppHead";

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
    signIn("line", { callbackUrl: "/" });
  }, []);

  return (
    <>
      <AppHead />
      <div
        className="
      flex flex-col
      justify-center items-center
      w-screen h-screen
      bg-white
      bg-center bg-cover
    "
        style={{ backgroundImage: "url('/background/login_background.png')" }}
      >
        <h1 className="text-4xl font-bold text-center">
          <Image width={215} height={132} src="/AILLA_logo_b.png" alt="AILLA" className="mx-auto" />
        </h1>
        <p className="mt-7 p-3 mx-auto text-center text-[#47556d]">
          AI英会話サービス「AILLA」へようこそ！
          <br />
          LINEアカウントでログインして
          <br />
          サービスを開始しましょう！
        </p>
        <button
          className="
        bg-green-500 hover:bg-green-700
        text-white font-bold py-2 rounded-[10px]
        mt-9 grid grid-cols-[2fr,7fr] items-center gap-3
        w-[270px]
      "
          onClick={() => signin()}
        >
          <div className="mr-3 border-r border-[#00000014] w-[100%] flex justify-center">
            <Image width={40} height={40} src="/line_icon.svg"  alt="line_icon" />
          </div>
          <p className="text-[19px]">
            LINEでログイン
          </p>
        </button>
      </div>
    </>
  );
}
