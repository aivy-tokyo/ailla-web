import React from "react";
import { FaQuestion } from "react-icons/fa";

interface QuestionIconProps {
  handleShowHint: () => void;
}

export const QuestionIcon: React.FC<QuestionIconProps> = ({
  handleShowHint,
}) => (
  <button
    className="h-[35px] w-[35px] rounded-full self-center bg-black border-2 border-white flex justify-center items-center cursor-pointer"
    onClick={handleShowHint}
  >
    <FaQuestion className="text-white text-[20px]" />
  </button>
);
