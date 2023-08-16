import React from 'react';
import { FaRegComments } from 'react-icons/fa';

interface ChatIconProps {
  setChatIconSelected: (selected: boolean) => void;
}

export const ChatIcon: React.FC<ChatIconProps> = ({ setChatIconSelected }) => (
  <div className="h-[35px] w-[35px] rounded-full self-center bg-black border-2 border-white flex justify-center items-center cursor-pointer" onClick={() => setChatIconSelected(true)}>
    <FaRegComments className="text-white text-[20px] self-center" />
  </div>
);
