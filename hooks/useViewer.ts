import { useContext } from "react";
import { ViewerContext } from "../features/vrmViewer/viewerContext";

export const useViewer = () => {
  const { viewer } = useContext(ViewerContext);
  return viewer;
};