import { useMediaQuery } from "react-responsive";

export const useResponsive = () => {
  const isDeskTop = useMediaQuery({minWidth: 900});

  const isMoblileLandscape = useMediaQuery({maxHeight: 550}) 

  return {
    isDeskTop,
    isMoblileLandscape,
  };
};