import React, { forwardRef } from "react";
import { IoMdChatbubbles } from "react-icons/io";
import { ButtonProps } from "../utils/types";

export const ButtonChat = forwardRef<HTMLButtonElement, ButtonProps>(
  function ChatIcon({ size, ...props }, ref) {
    return (
      <button
        ref={ref}
        className={`
        relative    
        border-0
        bg-transparent

    `}
        {...props}
      >
        <IoMdChatbubbles className="text-white/60 text-[2rem]" />
      </button>
    );
  },
);
