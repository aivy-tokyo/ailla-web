import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import {
  chatLogAtom,
} from "@/utils/atoms";
import { useAtomValue } from "jotai";
import { SpeechTextArea } from "./SpeechTextArea";
import { BottomUiDefault } from "./BottomUiDefault";
import { BottomUiChatIconSelected } from "./BottomUiChatIconSelected";
import { ChatMode } from "../utils/types";

type Props = {
  chatMode: ChatMode;
  setChatMode: Dispatch<SetStateAction<ChatMode>>;
  isMicRecording: boolean;
  handleShowHint: () => void;
  handleStartRecording: () => void;
  handleStopRecording: () => string;
  userMessage: string;
  handleChangeUserMessage: (e: ChangeEvent<HTMLInputElement>) => void;
  sendChat: (message: string) => void;
  setIsMicRecording: Dispatch<SetStateAction<boolean>>;
  roleOfAi?: string;
  roleOfUser?: string;
};

const BottomUi = ({
  chatMode,
  setChatMode,
  handleShowHint,
  handleStartRecording,
  handleStopRecording,
  userMessage,
  handleChangeUserMessage,
  isMicRecording,
  sendChat,
  setIsMicRecording,
  roleOfAi,
  roleOfUser,
}: Props) => {
  const chatLogs = useAtomValue(chatLogAtom);
  const [isChatLogExpanded, setIsChatLogExpanded] = useState<boolean>(false);

  const handleClickMicButton = useCallback(() => {
    setChatMode("mic");
    if (isMicRecording) {
      setIsMicRecording(false);
      setTimeout(() => {
        const resultText = handleStopRecording()
        sendChat(resultText);
      },3000);
    } else {
      handleStartRecording();
    }
  }, [setChatMode, isMicRecording, setIsMicRecording, handleStopRecording, sendChat, handleStartRecording]);

  const handleChatIconSelected = useCallback((selected: boolean) => {
    setChatMode(selected ? "text" : "mic");
  }, [setChatMode]);

  const toggleExpandChatLog = useCallback(() => {
    setIsChatLogExpanded((prev) => !prev);
  }, []);

  return (
    <>
      <div className="fixed bottom-0 flex flex-col  justify-between w-full">
        <div
          onClick={() => toggleExpandChatLog()}
          className={`z-10 relative flex  transition-height ease-in-out duration-150 justify-center cursor-pointer ${
            isChatLogExpanded ? "h-screen" : "h-36"
          }`}
        >
          <div
            className={`w-screen  max-w-[600px] overflow-hidden px-5 h-full flex  transition-color ease-in duration-150 flex-col ${
              isChatLogExpanded
                ? "overflow-y-scroll py-5 bg-black opacity-90"
                : "py-1 mask-top-fadeout top-0 absolute justify-end"
            }`}
          >
            <SpeechTextArea chatLogs={chatLogs} roleOfAi={roleOfAi} roleOfUser={roleOfUser}/>
          </div>
        </div>

        {!isChatLogExpanded && (
          <div className="w-full h-18 bg-[rgba(0,0,0,0.6)]  z-20  py-3 m-auto">
            {chatMode === "text" ? (
              <BottomUiChatIconSelected
                handleShowHint={handleShowHint}
                userMessage={userMessage}
                handleChangeUserMessage={handleChangeUserMessage}
                chatIconSelected={true}
                isMicRecording={isMicRecording}
                handleClickMicButton={handleClickMicButton}
                sendChat={sendChat}
              />
            ) : (
              <BottomUiDefault
                chatIconSelected={false}
                handleClickMicButton={handleClickMicButton}
                handleShowHint={handleShowHint}
                isMicRecording={isMicRecording}
                setChatIconSelected={handleChatIconSelected}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default BottomUi;
