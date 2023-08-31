import { useSession } from "next-auth/react";
import { AppHead } from "../components/AppHead";
import { RegisterContainer } from "../components/RegisterContainer";
import { useEffect } from "react";
import router from "next/router";
import { useAtomValue } from "jotai";
import { userIdAtom } from "../utils/atoms";

export default function RegisterPage() {
  const session = useSession();
  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.push("/login");
    }
  }, [session]);
  const userId = useAtomValue(userIdAtom);

  return (
    <>
      <AppHead />
      <RegisterContainer />
    </>
  );
}
