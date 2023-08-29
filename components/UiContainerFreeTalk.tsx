import {
  ChangeEvent,
  use,
  useCallback,
  useEffect,
  useState,
} from "react";
import BottomUi from "./BottomUi";
import { ChatHint } from "./ChatHint";
import { ChatMenu } from "./ChatMenu";
import { HeaderUi } from "./HeaderUi";
import { useUserInput } from "../hooks/useUserInput";
import { useFreeTalk } from "../hooks/useFreeTalk";
import { useRouter } from "next/router";
import { useFirstGreeting } from "../hooks/useFirstGreeting";
import { useSetAtom } from "jotai";
import { chatLogAtom } from "@/utils/atoms";

export const UiContainerFreeTalk: React.FC = () => {
  const router = useRouter();
  const [showHint, setShowHint] = useState<boolean>(false);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);
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

  // FreeTalkの状態管理とロジックを取得
  const {
    topic,
    messages,
    sendMessage,
    startFreeTalk,
  } = useFreeTalk();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    startFreeTalk();
  }, [startFreeTalk]);

  const endTalk = useCallback(() => {
    setChatLog([]);
    router.replace("/");
  }, [router, setChatLog]);

  const handleShowHint = useCallback(() => {
    setShowHint((prev) => !prev);
  }, [setShowHint]);

  const handleChangeUserMessage = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setUserMessage(e.target.value);
  }, [setUserMessage]);

  const sendUserMessage = useCallback(() => {
    console.log("sendUserMessage", userMessage);
    sendMessage(userMessage);
    setUserMessage("");
  }, [sendMessage, userMessage, setUserMessage]);

  if (!isClient) return <></>; //MEMO: ハイドレーションエラーを回避するための状態管理

  return (
    <>
      <HeaderUi onClickEndTalk={endTalk} />
      {/* { showHint && <ChatHint/>} */}
      {/* { showMenu && <ChatMenu/>} */}
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
    </>
  );
};
