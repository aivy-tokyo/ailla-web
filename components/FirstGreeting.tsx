import { PropsWithChildren, useContext, useState, useCallback, useEffect } from "react";
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
          fixed top-0 flex justify-center items-center h-screen w-full bg-opacity-60
          ${startButtonClicked ? "bg-transparent" : "bg-black"}
          `}
          >
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
      </>
    );
  }

  return <>{children}</>;
};
