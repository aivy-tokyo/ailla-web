import { useCallback, useEffect } from "react";
import BottomUi from "./BottomUi";
import { HeaderUi } from "./HeaderUi";
import { useFreeTalk } from "../hooks/useFreeTalk";
import { useRouter } from "next/router";
import { useAtomValue, useSetAtom } from "jotai";
import { chatLogAtom, isButtonUsageExplainedAtom } from "@/utils/atoms";
import { ButtonUsageModal } from "./ButtonUsageModal";

export const UiContainerFreeTalk: React.FC = () => {
  const router = useRouter();
  const setChatLog = useSetAtom(chatLogAtom);

  const endTalk = useCallback(() => {
    setChatLog([]);
    router.replace("/");
  }, [router, setChatLog]);

  // FreeTalkの状態管理とロジックを取得
  const isButtonUsageExplained = useAtomValue(isButtonUsageExplainedAtom);
  const { sendMessage, startFreeTalk } = useFreeTalk();
  useEffect(() => {
    if (isButtonUsageExplained) {
      startFreeTalk();
    }
  }, [startFreeTalk, isButtonUsageExplained]);

  return (
    <>
      <HeaderUi onClickEndTalk={endTalk} />
      <BottomUi sendChat={sendMessage} />
      <ButtonUsageModal />
    </>
  );
};
