import { useCallback, useRef, useState } from "react";
import { chatLogAtom, isCharactorSpeakingAtom } from "@/utils/atoms";
import { useAtomValue, useAtom } from "jotai";
import { SpeechTextArea } from "./SpeechTextArea";
import { ChatMode } from "../utils/types";
import { ButtonMic } from "./ButtonMic";
import { ButtonSendMessage } from "./ButtonSendMessage";
import { ButtonHelp } from "./ButtonHelp";
import { ButtonChat } from "./ButtonChat";
import { useVoiceInput } from "../hooks/useVoiceInput";
import { isButtonUsageExplainedAtom } from "@/utils/atoms";
import { ButtonClose } from "./ButtonClose";

type Props = {
  sendChat: (message: string) => void;
  roleOfAi?: string;
  roleOfUser?: string;
  toggleHint?: () => void;
};

const BottomUi = ({ sendChat, roleOfAi, roleOfUser, toggleHint }: Props) => {
  const isCharacterSpeaking = useAtomValue(isCharactorSpeakingAtom);
  const [isButtonUsageExplained, setIsButtonUsageExplained] = useAtom(
    isButtonUsageExplainedAtom
  );
  const [chatMode, setChatMode] = useState<ChatMode>("mic");

  // VoiceInputの状態管理とロジックを取得
  const { startRecording, stopRecording, isMicRecording } = useVoiceInput({
    onStopRecording: useCallback(
      (message: string) => {
        setIsButtonUsageExplained(true);
        sendChat(message);
      },
      [sendChat, setIsButtonUsageExplained]
    ),
  });

  // Text Inputの状態管理とロジックを取得
  const [inputValue, setInputValue] = useState<string>("");
  const changeInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);
  const submit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      sendChat(inputValue);
      setInputValue("");
    },
    [inputValue, sendChat]
  );

  // ChatLogの状態管理とロジックを取得
  const chatLogs = useAtomValue(chatLogAtom);
  const [isChatLogExpanded, setIsChatLogExpanded] = useState<boolean>(false);
  const chatLogScrollRef = useRef<HTMLDivElement>(null);
  const toggleExpandChatLog = useCallback(() => {
    setIsChatLogExpanded((prev) => !prev);
    setTimeout(() => {
      chatLogScrollRef.current?.scrollTo(
        0,
        chatLogScrollRef.current?.scrollHeight
      );
    }, 150);
  }, []);

  return (
    <>
      {/* チャットログを表示 */}
      <div className="fixed bottom-0 flex flex-col  justify-between w-full">
        <div
          onClick={() => toggleExpandChatLog()}
          className={`z-10 relative flex  transition-height ease-in-out duration-150 justify-center cursor-pointer ${
            isChatLogExpanded ? "h-screen" : "h-36"
          }`}
        >
          <div
            ref={chatLogScrollRef}
            className={`w-screen  max-w-[600px] overflow-hidden px-5 h-full flex  transition-color ease-in duration-150 flex-col ${
              isChatLogExpanded
                ? "overflow-y-scroll py-20 bg-black opacity-90"
                : "py-1 mask-top-fadeout top-0 absolute justify-end"
            }`}
          >
            <SpeechTextArea
              chatLogs={chatLogs}
              roleOfAi={roleOfAi}
              roleOfUser={roleOfUser}
            />
          </div>
        </div>

        {!isChatLogExpanded && (
          <div className="w-full h-18 bg-[rgba(0,0,0,0.6)] z-20 py-3">
            {chatMode === "text" ? (
              <form
                className="w-full max-w-md mx-auto flex justify-center items-center gap-3 px-3"
                onSubmit={submit}
              >
                <ButtonClose onClick={() => setChatMode("mic")} size="sm" />
                <input
                  type="text"
                  placeholder="文字を入力する"
                  value={inputValue}
                  className="input input-primary w-full"
                  onChange={changeInput}
                />
                <ButtonSendMessage
                  disabled={isCharacterSpeaking}
                  type="submit"
                />
              </form>
            ) : (
              <div className="w-full max-w-md mx-auto flex justify-center items-center gap-3 px-3">
                <ButtonHelp onClick={toggleHint} disabled={!toggleHint} />
                <div className="relative flex justify-center items-center">
                  {!isButtonUsageExplained && (
                    <span
                      className={`absolute top-0 tooltip tooltip-top tooltip-info ${
                        isButtonUsageExplained ? "" : "tooltip-open"
                      }`}
                      data-tip="マイクを使用するにはボタンを押し続けてください"
                    ></span>
                  )}
                  {isMicRecording && (
                    <span className="absolute w-[65%] h-[65%] bg-white rounded-full animate-ping"></span>
                  )}
                  <ButtonMic
                    isMicRecording={isMicRecording}
                    disabled={isCharacterSpeaking}
                    size="lg"
                    onMouseDown={() => startRecording()}
                    onMouseUp={() => stopRecording()}
                  />
                </div>
                <ButtonChat
                  disabled={isCharacterSpeaking}
                  onClick={() => setChatMode("text")}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default BottomUi;
