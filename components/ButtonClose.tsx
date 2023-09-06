import React, { forwardRef } from "react";
import { MdClose } from "react-icons/md";
import { ButtonProps } from "../utils/types";

export const ButtonClose = forwardRef<HTMLButtonElement, ButtonProps>(function ChatIcon(
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
      <MdClose />
    </button>
  );
});