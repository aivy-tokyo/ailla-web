import { useCallback, useMemo, useState } from "react";
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
    roleOfAi,
    roleOfUser,
  } = useSituationTalk();

  // Situationの選択肢を作成
  const situationListOptions = useMemo(() => {
    return situationList.map((situation, index) => ({
      label: situation.title,
      value: index.toString(),
    }));
  }, [situationList]);

  // Situationを選択した時の処理
  const handleSelectSituation = useCallback(
    (value: string) => {
      setBackgroundImagePath(backgroundImages[2].path);
      startSituation(situationList[Number(value)]);
    },
    [setBackgroundImagePath, situationList, startSituation]
  );

  // situation開始時の会話を管理する
  const [firstGreetingDone, setFirstGreetingDone] = useState<boolean>(false)
  // 始まりのボタンを押したかどうかの状態管理
  const [startButtonClicked, setStartButtonClicked] = useState<boolean>(false);
  const handleSkipFirstGreeting = useCallback(() => {
    setFirstGreetingDone(true);
  }, []);

  return (
    <>
      {!firstGreetingDone && situation && (
        <>
          <div
            className={`
            fixed top-0 flex flex-col justify-end items-center h-screen w-full pb-52 bg-opacity-60
            ${startButtonClicked ? "bg-transparent" : "bg-black"}
            `}
          >
          <div className="p-10">
          </div>
          <div className="flex flex-col justify-end items-center">
            <button
              className="btn btn-primary btn-xs"
              onClick={() => handleSkipFirstGreeting()}
            >
              スキップする
          </button>
          </div>
        </div>
        </>
      )}
      <HeaderUi onClickEndTalk={endTalk} />
      {showHint && situation && (
        <ChatHint situation={situation} steps={stepStatus} endPhrase="test" />
      )}
      {!situation && (
        <ChatMenu
          options={situationListOptions}
          onClickOption={handleSelectSituation}
        />
      )}
      {situation && (
        <BottomUi
          sendChat={sendMessage}
          toggleHint={toggleHint}
          roleOfAi={roleOfAi}
          roleOfUser={roleOfUser}
        />
      )}
      <ButtonUsageModal />
    </>
  );
};
