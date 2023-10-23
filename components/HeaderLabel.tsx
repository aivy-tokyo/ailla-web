import { PropsWithChildren } from "react";

export const HeaderLabel: React.FC<PropsWithChildren> = ({ children }) => (
  <h2 className="text-base text-[#47556D] font-bold">{children}</h2>
);
