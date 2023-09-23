import { useAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";
import { isButtonUsageExplainedAtom } from "../utils/atoms";
import { ButtonMic } from "./ButtonMic";
import { useVoiceInput } from "../hooks/useVoiceInput";

export function ButtonUsageModal() {
  const [isButtonUsageExplained, setIsButtonUsageExplained] = useAtom(
    isButtonUsageExplainedAtom
  );
  useEffect(() => {
    if (!isButtonUsageExplained) {
      // @ts-ignore
      modal_button_usage.showModal();
      setIsButtonUsageExplained(true);
    }
  }, [isButtonUsageExplained, setIsButtonUsageExplained]);

  const [recordingText, setRecordingText] = useState<string>("");
  const { startRecording, stopRecording, isMicRecording } = useVoiceInput({
    onStopRecording: useCallback((message: string) => {
      setRecordingText(message);
    }, []),
  });

  return (
    <dialog id="modal_button_usage" className="modal">
      <div className="modal-box text-center">
        <h3 className="font-bold text-lg">マイクボタンの使い方</h3>
        <p className="py-4">
          マイクを使用するには
          <br />
          ボタンを押し続けてください。
          <br />
          マイクを離すと音声認識が終了します。
        </p>
        <p className="py-4">試しに下のマイクボタンを押して話してみましょう！</p>
        <ButtonMic
          isMicRecording={isMicRecording}
          onButtonDown={startRecording}
          onButtonUp={stopRecording}
        />
        <p className="my-2 py-4 text-sm text-gray-500 bg-gray-50">
          {recordingText ||
            (isMicRecording && "音声認識中...") ||
            "ここに認識結果が表示されます"}
        </p>
        <div className="modal-action">
          <form method="dialog" className="flex justify-center w-full">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn">とじる</button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
