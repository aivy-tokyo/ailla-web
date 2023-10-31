import { useCallback, useEffect, useMemo, useState } from "react";
import BottomUi from "./BottomUi";
import { ChatHint } from "./ChatHint";
import { ChatMenu } from "./ChatMenu";
import { HeaderUi } from "./HeaderUi";
import { useRouter } from "next/router";
import { useSituationTalk } from "../hooks/useSituationTalk";
import { useSetAtom } from "jotai";
import { backgroundImagePathAtom, chatLogAtom } from "../utils/atoms";
import { backgroundImages } from "../utils/constants";
import { ButtonUsageModal } from "./ButtonUsageModal";

export const UiContainerSituation: React.FC = () => {
  const router = useRouter();

  const setBackgroundImagePath = useSetAtom(backgroundImagePathAtom);
  const setChatLog = useSetAtom(chatLogAtom);
  const [isSituationSelection, setIsSituationSelection] = useState<boolean>(false)

  // Hintの表示状態管理
  const [showHint, setShowHint] = useState<boolean>(false);
  const toggleHint = useCallback(() => {
    setShowHint(!showHint);
  }, [showHint]);

  // チャットを終了する関数
  const endTalk = useCallback(() => {
    setBackgroundImagePath(backgroundImages[0].path);
    setChatLog([]);
    router.replace("/");
  }, [router, setBackgroundImagePath, setChatLog]);

  // SituationTalkの状態管理とロジックを取得
  const {
    situation,
    stepStatus,
    situationList,
    sendMessage,
    startSituation,
    stopSpeaking,
    firstGreetingDone,
    endPhrase,
    isSituationTalkEnded,
    roleOfAi,
    roleOfUser,
  } = useSituationTalk();

  // Situationの選択肢を作成
  const situationListOptions = useMemo(() => {
    return situationList.map((situation, index) => ({
      label: situation.title,
      english: situation.titleEnglish,
      value: index.toString(),
    }));
  }, [situationList]);

  // Situationを選択した時の処理
  const handleSelectSituation = useCallback(
    (value: string) => {
      setBackgroundImagePath(backgroundImages[2].path);
      startSituation(situationList[Number(value)]);
    },
    [setBackgroundImagePath, situationList, startSituation],
  );

  const handleSkipFirstGreeting = useCallback(() => {
    stopSpeaking();
  }, [stopSpeaking]);

  useEffect(() => {
    if (isSituationTalkEnded) {
      endTalk();
    }
  }, [isSituationTalkEnded, endTalk]);

  return (
    <div
      className={!situation ? " h-full bg-[rgba(255,255,255,0.8)]" : "h-full"}
    >
      <HeaderUi onClickEndTalk={endTalk} isSituationSelection={isSituationSelection} />
      {!firstGreetingDone && situation && (
        <>
          <div
            className={`
            fixed top-0 flex flex-col justify-end items-center h-screen w-full pb-52 bg-opacity-60 z-50
            `}
          >
            <div className="p-10">
              {endPhrase?.description && (
                <div className="bg-white flex w-[24rem] text-center p-4 justify-center items-center padding-[1rem] gap-2.5 rounded-xl">
                  <p className="whitespace-pre-wrap text-black text-[0.8rem] font-[30rem]">
                    {endPhrase.description}
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
      {showHint && situation && (
        <ChatHint
          situation={situation}
          steps={stepStatus}
          endPhrase={endPhrase?.sentence}
          onClose={() => setShowHint(false)}
        />
      )}
      {!situation && (
        <ChatMenu
          options={situationListOptions}
          onClickOption={handleSelectSituation}
          setIsSelection={setIsSituationSelection}
          type="situation"
        />
      )}
      {situation && firstGreetingDone && (
        <BottomUi
          sendChat={sendMessage}
          toggleHint={toggleHint}
          roleOfAi={roleOfAi}
          roleOfUser={roleOfUser}
        />
      )}
      <ButtonUsageModal />
    </div>
  );
};
