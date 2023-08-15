import { useContext, useCallback } from "react";
import { ViewerContext } from "../features/vrmViewer/viewerContext";
import { buildUrl } from "../utils/buildUrl";
import { avatarPathAtom } from "@/utils/atoms";
import { useAtomValue } from "jotai";

export default function VrmViewer() {
  const { viewer } = useContext(ViewerContext);
  const avatarPath = useAtomValue(avatarPathAtom);

  const canvasRef = useCallback(
    (canvas: HTMLCanvasElement) => {
      if (canvas) {
        viewer.setup(canvas);
        viewer.loadVrm(avatarPath);

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
    [viewer,avatarPath]
  );

  return (
    <div className={`fixed h-screen left-0 top-0 w-full`}>
      <canvas ref={canvasRef} className={"h-full w-full"}></canvas>
    </div>
  );
}