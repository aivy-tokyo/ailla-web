import { AppHead } from "../components/AppHead";
import VrmViewer from "../components/VrmViewer";
import { AuthGuard } from "../components/AuthGuard";
import { UiContainerFreeTalk } from "../components/UiContainerFreeTalk";

export default function FreeTalkPage() {
  return (
    <>
      <AppHead />
      <AuthGuard>
        <VrmViewer />
        <UiContainerFreeTalk />
      </AuthGuard>
    </>
  );
}
