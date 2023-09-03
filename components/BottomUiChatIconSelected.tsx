import React, { useCallback } from "react";
import { FaRegPaperPlane } from "react-icons/fa";
import { QuestionIcon } from "./QuestionIcon";
import { MicIcon } from "./MicIcon";

interface BottomUiChatIconSelectedProps {
  handleShowHint: () => void;
  userMessage: string;
  handleChangeUserMessage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  chatIconSelected: boolean;
  isMicRecording: boolean;
  handleClickMicButton: () => void;
  sendChat: (message: string) => void;
}

export const BottomUiChatIconSelected: React.FC<
  BottomUiChatIconSelectedProps
> = ({
  handleShowHint,
  userMessage,
  handleChangeUserMessage,
  chatIconSelected,
  isMicRecording,
  handleClickMicButton,
  sendChat,
}) => {
  const handeSubmitForm = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      sendChat(userMessage);
    },
    [sendChat, userMessage]
  );

  return (
    <div className="flex max-w-[600px] h-[60px] items-center mx-auto justify-between px-5">
      <div>
        <QuestionIcon handleShowHint={handleShowHint} />
      </div>
      <form
        className="flex items-center w-full"
        onSubmit={handeSubmitForm}
      >
        <input
          type="text"
          placeholder="文字を入力する"
          value={userMessage}
          className="input input-primary w-full ml-5"
          onChange={handleChangeUserMessage}
        />
        {userMessage.length > 0 && (
          <div className="ml-5">
            <button
            type="submit"
            className="h-[35px] w-[35px] rounded-full self-center bg-black border-2 border-white flex justify-center items-center cursor-pointer"
          >
            <FaRegPaperPlane className="text-white text-[20px] self-center" />
          </button>
          </div>
        )}
      </form>
      {userMessage.length === 0 && (
        <div className="ml-5">
          <MicIcon
          chatIconSelected={chatIconSelected}
          isMicRecording={isMicRecording}
          handleClickMicButton={handleClickMicButton}
        />
        </div>
      )}
    </div>
  )
};
