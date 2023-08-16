import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback,
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
  handleStopRecording: () => void;
  userMessage: string;
  handleChangeUserMessage: (e: ChangeEvent<HTMLInputElement>) => void;
  sendChat: () => void;
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
}: Props) => {
  const chatLogs = useAtomValue(chatLogAtom);
  const [isChatLogExpanded, setIsChatLogExpanded] = useState<boolean>(false);

  const handleClickMicButton = () => {
    setChatMode("mic");
    if (isMicRecording) {
      handleStopRecording();
    } else {
      handleStartRecording();
    }
  };

  const handleChatIconSelected = (selected: boolean) => {
    setChatMode(selected ? "text" : "mic");
  };

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
            className={`w-screen  max-w-[600px] px-5 h-full flex  transition-color ease-in duration-150 flex-col ${
              isChatLogExpanded
                ? "overflow-y-scroll py-5 bg-black opacity-90"
                : "py-1 mask-top-fadeout top-0 absolute justify-end"
            }`}
          >
            <SpeechTextArea chatLogs={chatLogs} />
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
