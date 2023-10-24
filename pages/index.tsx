import { AppHead } from "../components/AppHead";
import VrmViewer from "../components/VrmViewer";
import { UiContainer } from "@/components/UiContainer";
import { AuthGuard } from "../components/AuthGuard";
import { useRouter } from "next/router";
import { UiContainerFreeTalk } from "../components/UiContainerFreeTalk";
import { UiContainerSituation } from "../components/UiContainerSituation";
import { UiContainerRepeatPractice } from "../components/UiContainerRepeatPractice";
import { FirstGreeting } from "../components/FirstGreeting";
import { PropsWithChildren, useContext, useState, useCallback } from "react";

type ContainerMode = "repeat-practice" | "situation" | "free-talk" | undefined;
const SwitchContainer: React.FC<{ mode: ContainerMode }> = ({ mode }) => {
  switch (mode) {
    case "repeat-practice":
      return <UiContainerRepeatPractice />;
    case "situation":
      return <UiContainerSituation />;
    case "free-talk":
      return <UiContainerFreeTalk />;
    default:
      return <UiContainer />;
  }
};


const FullscreenContainer: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <div className="fixed h-screen w-screen left-0 top-0">
      {children}
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const { mode } = router.query;

  return (
    <>
      <AppHead />
      <AuthGuard>
        <VrmViewer />
        <FullscreenContainer>
          <FirstGreeting>
            <SwitchContainer mode={mode as ContainerMode} />
          </FirstGreeting>
        </FullscreenContainer>
      </AuthGuard>
    </>
  );
}
