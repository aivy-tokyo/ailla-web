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
import { useSetAtom } from "jotai";
import { chatLogAtom } from "@/utils/atoms";

export const UiContainerFreeTalk: React.FC = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState<boolean>(false);
  const setChatLog = useSetAtom(chatLogAtom);

  // FreeTalkの状態管理とロジックを取得
  const {
    sendMessage,
    startFreeTalk,
  } = useFreeTalk();

  // UserInputの状態管理とロジックを取得
  const {
    chatMode,
    setChatMode,
    isMicRecording,
    userMessage,
    handleStartRecording,
    handleStopRecording,
    setUserMessage,
  } = useUserInput({
    onStartRecording: () => null,
    onStopRecording: sendMessage,
  });

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

  const handleChangeUserMessage = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setUserMessage(e.target.value);
  }, [setUserMessage]);

  const sendUserMessage = useCallback((message: string) => {
    // sendMessage(userMessage);
    sendMessage(message);
    setUserMessage("");
  }, [sendMessage, setUserMessage]);

  if (!isClient) return <></>; //MEMO: ハイドレーションエラーを回避するための状態管理

  return (
    <>
      <HeaderUi onClickEndTalk={endTalk} />
      <BottomUi
        chatMode={chatMode}
        setChatMode={setChatMode}
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
