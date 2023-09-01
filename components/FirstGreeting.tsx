import { PropsWithChildren, useContext, useState, useCallback} from "react";
import { ViewerContext } from "../features/vrmViewer/viewerContext";
import { speakFirstConversation } from "../features/speakFirstConversation";
import { useAtomValue } from "jotai";
import { userInfoAtom, textToSpeechApiTypeAtom } from "../utils/atoms";
import * as Sentry from "@sentry/nextjs";

export const FirstGreeting: React.FC<PropsWithChildren> = ({ children }) => {
  const { viewer } = useContext(ViewerContext);
  const userInfo = useAtomValue(userInfoAtom);
  const textToSpeechApiType = useAtomValue(textToSpeechApiTypeAtom);

  // 始まりのボタンを押したかどうかの状態管理
  const [startButtonClicked, setStartButtonClicked] = useState<boolean>(false);
  // 最初の挨拶をしたかどうかの状態管理
  const [firstGreetingDone, setFirstGreetingDone] = useState<boolean>(false);

  const greet = useCallback(async () => {
    if (viewer.model && !firstGreetingDone) {
      try {
        await viewer.model.resumeAudio();//MEMO:iOSだとAudioContextのstateが'suspended'になり、音声が再生できないことへの対策。
        setStartButtonClicked(true);
        await speakFirstConversation({
          viewerModel: viewer.model,
          userName: userInfo?.name || "",
          textToSpeechApiType,
        });
        setFirstGreetingDone(true);
      } catch (error) {
        Sentry.captureException(error);
      }
    }
  }, [firstGreetingDone, textToSpeechApiType, userInfo?.name, viewer.model]);

  const handleSkipFirstGreeting = useCallback(() => {
    viewer.model?.stopSpeak();
    setFirstGreetingDone(true);
  }, [viewer.model]);

  if (!firstGreetingDone) {
    return (
      <>
        <div
          className={`
          fixed top-0 flex flex-col justify-center items-center h-screen w-full bg-opacity-60
          ${startButtonClicked ? "bg-transparent" : "bg-black"}
          `}
          >
          <div className="flex-1 flex flex-col justify-end items-center">
          {startButtonClicked ?
          (
            <button
              className="btn btn-secondary is-rounded is-large is-fullwidth"
              onClick={() => handleSkipFirstGreeting()}
            >
              スキップする
            </button>
          )
          :
          (
            <button
              className="btn btn-secondary is-rounded is-large is-fullwidth"
              onClick={greet}
            >
              AILLAと英会話を始めましょう！
            </button>
          )}
          </div>
          <div className="p-10">
            <p className="alert">マナーモード設定してる場合、発音されません</p>
          </div>
        </div>
      </>
    );
  }

  return <>{children}</>;
};
