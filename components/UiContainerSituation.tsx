import {
  ChangeEvent,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import BottomUi from "./BottomUi";
import { ChatHint } from "./ChatHint";
import { ChatMenu } from "./ChatMenu";
import { HeaderUi } from "./HeaderUi";
import { useUserInput } from "../hooks/useUserInput";
import { useRouter } from "next/router";
import { useSituationTalk } from "../hooks/useSituationTalk";
import { useSetAtom } from "jotai";
import { backgroundImagePathAtom, chatLogAtom } from "../utils/atoms";
import { backgroundImages } from "../utils/constants";

export const UiContainerSituation: React.FC = () => {
  const router = useRouter();
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);
  const setBackgroundImagePath = useSetAtom(backgroundImagePathAtom);
  const setChatLog = useSetAtom(chatLogAtom);


  // UserInputの状態管理とロジックを取得
  const {
    chatMode,
    setChatMode,
    isMicRecording,
    userMessage,
    handleStartRecording,
    handleStopRecording,
    setUserMessage,
  } = useUserInput();

  // SituationTalkの状態管理とロジックを取得
  const {
    situation,
    situationList,
    nextStep,
    messages,
    sendMessage,
    startSituation,
  } = useSituationTalk();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const endTalk = useCallback(() => {
    setBackgroundImagePath(backgroundImages[0].path);
    setChatLog([]);
    router.replace("/");
  }, [router, setBackgroundImagePath, setChatLog]);

  const handleChangeUserMessage = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setUserMessage(e.target.value);
    },
    [setUserMessage]
  );

  const handleShowHint = useCallback(() => {
    setShowHint(!showHint);
  }, [showHint]);

  const sendUserMessage = useCallback(() => {
    sendMessage(userMessage);
    setUserMessage("");
  }, [sendMessage, userMessage, setUserMessage]);

  const situationListOptions = useMemo(() => {
    return situationList.map((situation, index) => ({
      label: situation.title,
      value: index.toString(),
    }));
  }, [situationList]);
  const handleSelectSituation = useCallback(
    (value: string) => {
      setBackgroundImagePath(backgroundImages[2].path);
      startSituation(situationList[Number(value)]);
    },
    [setBackgroundImagePath, situationList, startSituation]
  );

  if (!isClient) return <></>; //MEMO: ハイドレーションエラーを回避するための状態管理

  return (
    <>
      <HeaderUi onClickEndTalk={endTalk} />
      {nextStep && showHint && (
        <ChatHint description={nextStep.description} hint={nextStep.hint} />
      )}
      {!situation && (
        <ChatMenu
          options={situationListOptions}
          onClickOption={handleSelectSituation}
        />
      )}
      {situation && (
        <BottomUi
          chatMode={chatMode}
          setChatMode={setChatMode}
          handleShowHint={handleShowHint}
          handleStartRecording={handleStartRecording}
          handleStopRecording={handleStopRecording}
          userMessage={userMessage}
          handleChangeUserMessage={handleChangeUserMessage}
          isMicRecording={isMicRecording}
          sendChat={sendUserMessage}
        />
      )}
    </>
  );
};
