import { AppHead } from "../components/AppHead";
import VrmViewer from "../components/VrmViewer";
import { UiContainer } from "@/components/UiContainer";

export default function Home() {

  return (
    <>
      <AppHead />
      <VrmViewer />
      <UiContainer/>
    </>
  );
}
