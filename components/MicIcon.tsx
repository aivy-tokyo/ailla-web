import React from 'react';
import { FaMicrophone } from 'react-icons/fa';

interface MicIconProps {
  chatIconSelected: boolean;
  isMicRecording: boolean;
  handleClickMicButton: () => void;
}

export const MicIcon: React.FC<MicIconProps> = ({ chatIconSelected, isMicRecording, handleClickMicButton }) => (
  <div className={`${chatIconSelected ? 'w-[35px] h-[35px]' : 'w-[60px] h-[60px]'} rounded-full bg-black border-2 border-white flex justify-center items-center cursor-pointer`} onClick={handleClickMicButton}>
    <FaMicrophone className={`${isMicRecording ? ' text-red-500' : 'text-white'} ${chatIconSelected ? 'text-[23px]' : 'text-[30px]'}`} />
  </div>
);
