import { PropsWithChildren } from "react";

export const HeaderLabel: React.FC<PropsWithChildren> = ({ children }) => (
  <h2 className="text-sm text-white font-bold mt-5 mb-3">{children}</h2>
);
