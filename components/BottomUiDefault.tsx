import React from 'react';
import { QuestionIcon } from './QuestionIcon';
import { MicIcon } from './MicIcon';
import { ChatIcon } from './ChatIcon';

interface BottomUiDefaultProps {
  handleShowHint: () => void;
  chatIconSelected: boolean;
  isMicRecording: boolean;
  handleClickMicButton: () => void;
  setChatIconSelected: (selected: boolean) => void;
}

export const BottomUiDefault: React.FC<BottomUiDefaultProps> = ({ handleShowHint, chatIconSelected, isMicRecording, handleClickMicButton, setChatIconSelected }) => (
  <div className="flex max-w-[250px] h-[60px] justify-between items-center mx-auto px-5">
    <QuestionIcon handleShowHint={handleShowHint} />
    <MicIcon chatIconSelected={chatIconSelected} isMicRecording={isMicRecording} handleClickMicButton={handleClickMicButton} />
    <ChatIcon setChatIconSelected={setChatIconSelected} />
  </div>
);
