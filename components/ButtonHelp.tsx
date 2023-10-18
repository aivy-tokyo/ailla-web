import React, { forwardRef } from "react";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { ButtonProps } from "../utils/types";

export const ButtonHelp = forwardRef<HTMLButtonElement, ButtonProps>(
  function ChatIcon({ size, ...props }, ref) {
    return (
      <button
        ref={ref}
        className={`
    relative    
    border-0
    bg-transparent
    btn
    ${`btn-${size}`}
  `}
        {...props}
      >
        <AiOutlineQuestionCircle className="text-white/60 text-[2rem]" />
      </button>
    );
  }
);
