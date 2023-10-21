import { useCallback, useMemo, useState } from "react";
import BottomUi from "./BottomUi";
import { ChatMenu } from "./ChatMenu";
import { HeaderUi } from "./HeaderUi";
import { useRouter } from "next/router";
import { useAtomValue, useSetAtom } from "jotai";
import { chatLogAtom, backgroundImagePathAtom } from "@/utils/atoms";
import { ButtonUsageModal } from "./ButtonUsageModal";
import { useRepeatPractice } from "@/hooks/useRepeatPractice";
import { backgroundImages } from "../utils/constants";

export const UiContainerRepeatPractice: React.FC = () => {
  const router = useRouter();

  const setBackgroundImagePath = useSetAtom(backgroundImagePathAtom);
  const setChatLog = useSetAtom(chatLogAtom);
  const [isRepeatPracticeSelection, setIsRepeatPracticeSelection] = useState<boolean>(false)

  // Hintの表示状態管理
  const [showHint, setShowHint] = useState<boolean>(false);
  const toggleHint = useCallback(() => {
    setShowHint(!showHint);
  }, [showHint]);

  const endTalk = useCallback(() => {
    router.replace("/");
  }, [router]);

  const {
    repeatPractice,
    repeatPracticeList,
    roleOfAi,
    roleOfUser,
    startRepeatPractice,
  } = useRepeatPractice()

  // RepeatPracticeの選択肢を作成
  const repeatPracticeListOptions = useMemo(() => {
    return repeatPracticeList.map((repeatPractice, index) => ({
      label: repeatPractice.title,
      english: repeatPractice.titleEnglish,
      value: index.toString(),
    }));
  }, [repeatPracticeList]);

  const handleSelectRepeatPractice = useCallback(
    (value: string) => {
      setBackgroundImagePath(backgroundImages[2].path);
      startRepeatPractice(repeatPracticeList[Number(value)]);
    },
    [setBackgroundImagePath, repeatPracticeList, startRepeatPractice],
  );

  return (
    <div className={!repeatPractice ? "h-full bg-[rgba(255,255,255,0.8)]" : "h-full"}>
      <HeaderUi onClickEndTalk={endTalk} />
      {!repeatPractice && (
        <ChatMenu
          options={repeatPracticeListOptions}
          onClickOption={handleSelectRepeatPractice}
          setIsSelection={setIsRepeatPracticeSelection}
          type="repeatPractice"
        />
      )}
      {repeatPractice && (
        <BottomUi
          sendChat={() => {}}
          toggleHint={toggleHint}
          roleOfAi={roleOfAi}
          roleOfUser={roleOfUser}
        />
      )}
      <ButtonUsageModal />
    </div>
  );
};
