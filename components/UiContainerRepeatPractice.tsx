import { useCallback, useMemo, useState, useEffect } from "react";
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

  const endTalk = useCallback(() => {
    router.replace("/");
  }, [router]);

  const {
    repeatPractice,
    repeatPracticeList,
    roleOfAi,
    roleOfUser,
    firstGreetingDone,
    firstConversation,
    isRepeatPracticeEnded,
    startRepeatPractice,
    sendMessage,
    stopSpeaking,
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

  const handleSkipFirstGreeting = useCallback(() => {
    stopSpeaking();
  }, [stopSpeaking]);

  useEffect(() => {
    if (isRepeatPracticeEnded) {
      endTalk();
    }
  }, [isRepeatPracticeEnded, endTalk]);

  return (
    <div className={!repeatPractice ? "h-full bg-[rgba(255,255,255,0.8)]" : "h-full"}>
      <HeaderUi onClickEndTalk={endTalk} />
      {!firstGreetingDone && repeatPractice && (
        <>
          <div
            className={`
            fixed top-0 flex flex-col justify-end items-center h-screen w-full pb-52 bg-opacity-60 z-50
            `}
          >
            <div className="p-10">
              {firstConversation?.description && (
                <div className="bg-white flex w-[24rem] text-center p-4 justify-center items-center padding-[1rem] gap-2.5 rounded-xl">
                  <p className="whitespace-pre-wrap text-black text-[0.8rem] font-[30rem]">
                    {firstConversation.description}
                  </p>
                </div>
              )}
            </div>
            <div className="flex justify-center bg-white bg-opacity-20 w-[8rem] h-[2.3rem] rounded-[7rem] absolute left-1/2 transform -translate-x-1/2 bottom-[3rem]">
              <button
                className="text-[1rem]"
                onClick={() => handleSkipFirstGreeting()}
              >
                スキップする
              </button>
            </div>
          </div>
        </>
      )}
      {!repeatPractice && (
        <ChatMenu
          options={repeatPracticeListOptions}
          onClickOption={handleSelectRepeatPractice}
          setIsSelection={setIsRepeatPracticeSelection}
          type="repeatPractice"
        />
      )}
      {repeatPractice && firstGreetingDone && (
        <BottomUi
          sendChat={sendMessage}
          roleOfAi={roleOfAi}
          roleOfUser={roleOfUser}
        />
      )}
      <ButtonUsageModal />
    </div>
  );
};
