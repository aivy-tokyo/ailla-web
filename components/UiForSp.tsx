import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback,
  useState,
} from "react";
import EndTalkButton from "./EndTalkButton";
import TranslateToggleSwitch from "./TranslateToggleSwitch";
import {
  FaRegSun,
} from "react-icons/fa";
import {
  chatLogAtom,
} from "@/utils/atoms";
import { useAtomValue } from "jotai";
import { useEnglishChat } from "@/hooks/useEnglishChat";
import { SpeechTextArea } from "./SpeechTextArea";
import { BottomUiDefault } from "./BottomUiDefault";
import { BottomUiChatIconSelected } from "./BottomUiChatIconSelected";
import { SettingContainer } from "./SettingContainer";
import { ChatHint } from "./ChatHint";
import { ChatMenu } from "./ChatMenu";

type Props = {
  showHint: boolean;
  handleShowHint: () => void;
  handleStartRecording: () => void;
  handleStopRecording: () => void;
  setUserMessage: Dispatch<SetStateAction<string>>;
  userMessage: string;
  handleChangeUserMessage: (e: ChangeEvent<HTMLInputElement>) => void;
  isMicRecording: boolean;
};

const UiForSp = ({
  showHint,
  handleShowHint,
  handleStartRecording,
  handleStopRecording,
  userMessage,
  setUserMessage,
  handleChangeUserMessage,
  isMicRecording,
}: Props) => {
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [showSetting, setShowSetting] = useState<boolean>(false);
  const [chatIconSelected, setChatIconSelected] = useState<boolean>(false);
  const { handleSendChat } = useEnglishChat();
  const chatLogs = useAtomValue(chatLogAtom);
  const [isChatLogExpanded, setIsChatLogExpanded] = useState<boolean>(false);

  const sendChat = () => {
    handleSendChat(userMessage);
    setUserMessage("");
  };

  const handleClickMicButton = () => {
    if (chatIconSelected) {
      setChatIconSelected(false);
    }
    if (isMicRecording) {
      handleStopRecording();
    } else {
      handleStartRecording();
    }
  };

  const toggleExpandChatLog = useCallback(() => {
    setIsChatLogExpanded((prev) => !prev);
  }, []);

  return (
    <>
      {/* SP版:上部のUI群 */}
      {!isChatLogExpanded && (
        <div className="flex h-12 justify-between m-2 pt-2">
          <TranslateToggleSwitch />
          <div className="flex z-10">
            <EndTalkButton />
            <FaRegSun
              className="text-white text-[34px] self-center"
              onClick={() => setShowSetting(true)}
            />
          </div>
        </div>
      )}

      { showHint && <ChatHint/>}
      { showMenu && <ChatMenu/>}
      { showSetting && <SettingContainer onClose={() => setShowSetting(false)}/> }

      {/* 下部のUI群 */}
      <div className="fixed bottom-0 flex flex-col  justify-between w-full">
        <div
          onClick={() => toggleExpandChatLog()}
          className={`z-10 relative flex  transition-height ease-in-out duration-150 justify-center cursor-pointer ${
            isChatLogExpanded ? "h-screen" : "h-56"
          }`}
        >
          <div
            className={`w-screen  max-w-[600px] px-5 h-full flex  transition-color ease-in duration-150 hover:bg-black hover:opacity-80 flex-col ${
              isChatLogExpanded
                ? "overflow-y-scroll py-5 bg-black opacity-80"
                : "py-1 mask-top-fadeout top-0 absolute justify-end"
            }`}
          >
            <SpeechTextArea chatLogs={chatLogs} />
          </div>
        </div>

        {!isChatLogExpanded && (
          <div className="w-full h-18 bg-[rgba(0,0,0,0.6)]  z-20  py-3 m-auto">
            {chatIconSelected ? (
              <BottomUiChatIconSelected
                handleShowHint={handleShowHint}
                userMessage={userMessage}
                handleChangeUserMessage={handleChangeUserMessage}
                chatIconSelected={chatIconSelected}
                isMicRecording={isMicRecording}
                handleClickMicButton={handleClickMicButton}
                sendChat={sendChat}
              />
            ) : (
              <BottomUiDefault
                chatIconSelected={chatIconSelected}
                handleClickMicButton={handleClickMicButton}
                handleShowHint={handleShowHint}
                isMicRecording={isMicRecording}
                setChatIconSelected={setChatIconSelected}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default UiForSp;
