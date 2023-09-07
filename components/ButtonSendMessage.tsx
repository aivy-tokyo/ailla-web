import React, { forwardRef } from "react";
import { FaRegPaperPlane } from "react-icons/fa";
import { ButtonProps } from "../utils/types";

export const ButtonSendMessage = forwardRef<HTMLButtonElement, ButtonProps>(
  function ChatIcon({ size, ...props }, ref) {
    return (
      <button
        ref={ref}
        className={`
      relative
      btn btn-circle 
      btn-neutral
      ${`btn-${size}`}  
      `}
        {...props}
      >
        <FaRegPaperPlane />
      </button>
    );
  }
);
