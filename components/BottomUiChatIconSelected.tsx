import React from 'react';
import { FaRegPaperPlane } from 'react-icons/fa';
import { QuestionIcon } from './QuestionIcon';
import { MicIcon } from './MicIcon';

interface BottomUiChatIconSelectedProps {
  handleShowHint: () => void;
  userMessage: string;
  handleChangeUserMessage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  chatIconSelected: boolean;
  isMicRecording: boolean;
  handleClickMicButton: () => void;
  sendChat: (message:string) => void;
}

export const BottomUiChatIconSelected: React.FC<BottomUiChatIconSelectedProps> = ({
  handleShowHint,
  userMessage,
  handleChangeUserMessage,
  chatIconSelected,
  isMicRecording,
  handleClickMicButton,
  sendChat,
}) => (
  <div className="flex max-w-[900px] h-[60px] items-center mx-auto justify-between px-5">
    <QuestionIcon handleShowHint={handleShowHint} />
    <input type="text" placeholder="文字を入力する" value={userMessage} className="w-[70%] rounded-full px-4 h-10 text-white" onChange={handleChangeUserMessage} />
    {userMessage.length > 0 ? (
      <div className="h-[35px] w-[35px] rounded-full self-center bg-black border-2 border-white flex justify-center items-center cursor-pointer" onClick={() =>sendChat(userMessage)}>
        <FaRegPaperPlane className="text-white text-[20px] self-center" />
      </div>
    ) : (
      <MicIcon chatIconSelected={chatIconSelected} isMicRecording={isMicRecording} handleClickMicButton={handleClickMicButton} />
    )}
  </div>
);
