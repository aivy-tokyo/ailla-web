import React, { forwardRef } from "react";
import { FaRegComments } from "react-icons/fa";
import { ButtonProps } from "../utils/types";

export const ButtonChat = forwardRef<HTMLButtonElement, ButtonProps>(function ChatIcon(
  {size, ...props},
  ref
) {
  return (
    <button ref={ref} className={`
      relative
      btn btn-circle 
      btn-neutral
      ${`btn-${size}`}
    `} {...props}>
      <FaRegComments />
    </button>
  );
});
