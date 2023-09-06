import React, { forwardRef } from "react";
import { FaMicrophone } from "react-icons/fa";
import { ButtonProps } from "../utils/types";

export const ButtonMic = forwardRef<
  HTMLButtonElement,
  ButtonProps & {
    isMicRecording: boolean;
  }
>(function ChatIcon({ isMicRecording, size, ...props }, ref) {
  return (
    <button
      ref={ref}
      className={`
      relative
      btn btn-circle 
      ${`btn-${size}`}
      ${isMicRecording ? "btn-secondary" : "btn-neutral"}
    `}
      {...props}
    >
      <FaMicrophone />
    </button>
  );
});
