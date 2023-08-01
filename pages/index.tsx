import { Inter } from "next/font/google";
import { useAtomValue } from "jotai";
import { chatProcessingAtom } from "../utils/atoms";
import { AppHead } from "../components/AppHead";
import VrmViewer from "../components/VrmViewer";
import LineLoginButton from "../components/LineLoginButton";
import { UiContainer } from "@/components/UiContainer";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const chatProcessing = useAtomValue(chatProcessingAtom);
  return (
    <>
      <AppHead />
      <VrmViewer />
      <UiContainer/>
    </>
  );
}
