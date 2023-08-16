import { AppHead } from "../components/AppHead";
import VrmViewer from "../components/VrmViewer";
import { UiContainer } from "@/components/UiContainer";
import { AuthGuard } from "../components/AuthGuard";
import { useRouter } from "next/router";
import { UiContainerFreeTalk } from "../components/UiContainerFreeTalk";

type ContainerMode = "repeat-practice" | "situation" | "free-talk" | undefined;
const SwitchContainer: React.FC<{ mode: ContainerMode}> = ({ mode }) => {
  switch (mode) {
    case "repeat-practice":
      return <UiContainer />;
    case "situation":
      return <UiContainer />;
    case "free-talk":
      return <UiContainerFreeTalk />;
    default:
      return <UiContainer />;
  }
}

export default function Home() {
  const router = useRouter();
  const { mode } = router.query;

  return (
    <>
      <AppHead />
      <AuthGuard>
        <VrmViewer />
        <SwitchContainer mode={mode as ContainerMode} />
      </AuthGuard>
    </>
  );
}
