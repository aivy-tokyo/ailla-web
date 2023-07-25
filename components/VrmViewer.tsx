import { useContext, useCallback } from "react";
import { ViewerContext } from "../features/vrmViewer/viewerContext";
import { buildUrl } from "../utils/buildUrl";
import { useResponsive } from "../hooks/useResponsive";

export default function VrmViewer() {
  const { viewer } = useContext(ViewerContext);
  const { isDeskTop } = useResponsive();

  const canvasRef = useCallback(
    (canvas: HTMLCanvasElement) => {
      if (canvas) {
        viewer.setup(canvas);
        // viewer.loadVrm(buildUrl("/AvatarSample_A2.vrm"));
        viewer.loadVrm("/AvatarSample_A2.vrm");

        // Drag and DropでVRMを差し替え
        canvas.addEventListener("dragover", function (event) {
          event.preventDefault();
        });

        canvas.addEventListener("drop", function (event) {
          event.preventDefault();

          const files = event.dataTransfer?.files;
          if (!files) {
            return;
          }

          const file = files[0];
          if (!file) {
            return;
          }

          const file_type = file.name.split(".").pop();
          if (file_type === "vrm") {
            const blob = new Blob([file], { type: "application/octet-stream" });
            const url = window.URL.createObjectURL(blob);
            viewer.loadVrm(url);
          }
        });
      }
    },
    [viewer]
  );

  return (
    <div className={`absolute ${isDeskTop ? 'top-0 h-[100vh]' : ' top-[100px] h-[calc(100vh-100px)]' } left-0 w-screen  overflow-hidden`}>
      <canvas ref={canvasRef} className={"h-full w-full"}></canvas>
    </div>
  );
}