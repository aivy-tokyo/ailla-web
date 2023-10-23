import { PropsWithChildren } from "react";

export const HeaderLabel: React.FC<PropsWithChildren> = ({ children }) => (
  <h2 className="text-base text-[#47556D] font-bold mt-5 mb-3">{children}</h2>
);
