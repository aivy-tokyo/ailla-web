import { Inter } from "next/font/google";
import { useAtomValue } from "jotai";
import { chatProcessingAtom } from "../utils/atoms";
import { AppHead } from "../components/AppHead";
import VrmViewer from "../components/VrmViewer";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const chatProcessing = useAtomValue(chatProcessingAtom);
  return (
    <>
      <AppHead />
      <VrmViewer />
    </>
  );
}
