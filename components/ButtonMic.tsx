import React, { forwardRef } from "react";
import { FaMicrophone } from "react-icons/fa";
import { ButtonProps } from "../utils/types";

export const ButtonMic = forwardRef<
  HTMLButtonElement,
  ButtonProps & {
    isMicRecording: boolean;
    onButtonDown: () => void;
    onButtonUp: () => void;
  }
>(function ChatIcon({ isMicRecording, size, ...props }, ref) {
  const handleButtonUp = () => {
    props.onButtonUp();
  };

  const handleButtonDown = () => {
    props.onButtonDown();
  };

  return (
    <button
      ref={ref}
      className={`
      relative
      border-0      
      btn btn-circle shadow
      ${`btn-${size}`}
      text-white
      bg-gradient-pink
    `}
      onPointerDown={handleButtonDown}
      onPointerUp={handleButtonUp}
      onTouchStart={handleButtonDown}
      onTouchEnd={handleButtonUp}
      {...props}
    >
      <FaMicrophone size={24} />
    </button>
  );
});
