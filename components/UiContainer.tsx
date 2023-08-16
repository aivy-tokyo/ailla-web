import {
  ChangeEvent,
  useEffect,
  useState,
} from "react";
import BottomUi from "./BottomUi";
import { useAtomValue } from "jotai";
import { chatLogAtom } from "@/utils/atoms";
import { useUiContainerLogic } from "../hooks/useUiContainerLogic";
import { ChatHint } from "./ChatHint";
import { ChatMenu } from "./ChatMenu";
import { HeaderUi } from "./HeaderUi";

export const UiContainer = () => {
  const [showHint, setShowHint] = useState<boolean>(false);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);
  const chatLog = useAtomValue(chatLogAtom);
  
  // カスタムフックからロジックと状態を取得
  const {
    chatMode,
    setChatMode,
    isMicRecording,
    userMessage,
    handleSendText,
    handleStartRecording,
    handleStopRecording,
    setUserMessage,
    firstGreeting,
    firstGreetingDone,
  } = useUiContainerLogic();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleShowHint = () => {
    setShowHint((prev) => !prev);
  };

  const handleChangeUserMessage = (e: ChangeEvent<HTMLInputElement>) => {
    setUserMessage(e.target.value);
  };

  if (!isClient) return <></>; //MEMO: ハイドレーションエラーを回避するための状態管理

  return (
    <>
      <HeaderUi />
      { showHint && <ChatHint/>}
      { showMenu && <ChatMenu/>}
      <BottomUi
        chatMode={chatMode}
        setChatMode={setChatMode}
        handleShowHint={handleShowHint}
        handleStartRecording={handleStartRecording}
        handleStopRecording={handleStopRecording}
        userMessage={userMessage}
        handleChangeUserMessage={handleChangeUserMessage}
        isMicRecording={isMicRecording}
        sendChat={handleSendText}
      />
      {!firstGreetingDone && chatLog.length === 0 && (
        <div className="fixed top-0 flex justify-center items-center h-screen w-full bg-black bg-opacity-60">
          <button
            className="btn btn-secondary is-rounded is-large is-fullwidth "
            onClick={() => firstGreeting()}
          >
            start
          </button>
        </div>
      )}
    </>
  );
};
