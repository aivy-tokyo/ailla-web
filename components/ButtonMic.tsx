import React, { forwardRef } from "react";
import { IoMicOutline } from "react-icons/io5";
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
      {isMicRecording ? (
        <div className="px-8 py-1 flex items-center justify-center h-full">
          <div className="bar w-1 mx-[0.13rem] bg-white animate-stretch1"></div>
          <div className="bar w-1 mx-[0.13rem] bg-white animate-stretch2"></div>
          <div className="bar w-1 mx-[0.13rem] bg-white animate-stretch3"></div>
          <div className="bar w-1 mx-[0.13rem] bg-white animate-stretch4"></div>
          <div className="bar w-1 mx-[0.13rem] bg-white animate-stretch5"></div>
          <div className="bar w-1 mx-[0.13rem] bg-white animate-stretch6"></div>
        </div>
      ) : (
        <IoMicOutline size={40} />
      )}
    </button>
  );
});
