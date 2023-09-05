import React from 'react';
import { QuestionIcon } from './QuestionIcon';
import { MicIcon } from './MicIcon';
import { ChatIcon } from './ChatIcon';

interface BottomUiDefaultProps {
  chatIconSelected: boolean;
  isMicRecording: boolean;
  handleClickMicButton: () => void;
  setChatIconSelected: (selected: boolean) => void;
  handleShowHint?: () => void;
}

export const BottomUiDefault: React.FC<BottomUiDefaultProps> = ({ handleShowHint, chatIconSelected, isMicRecording, handleClickMicButton, setChatIconSelected }) => (
  <div className="flex max-w-[250px] h-[60px] gap-5 justify-center items-center mx-auto px-5">
    {handleShowHint && <QuestionIcon handleShowHint={handleShowHint} />}
    <MicIcon chatIconSelected={chatIconSelected} isMicRecording={isMicRecording} handleClickMicButton={handleClickMicButton} />
    {/* <ChatIcon setChatIconSelected={setChatIconSelected} /> */}
  </div>
);
