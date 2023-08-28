import {
  useCallback,
  useContext,
} from "react";
import { ViewerContext } from "../features/vrmViewer/viewerContext";
import { useAtom, useAtomValue } from "jotai";
import {
  firstGreetingDoneAtom,
  userInfoAtom,
  textToSpeechApiTypeAtom,
} from "@/utils/atoms";
import { speakFirstConversation } from "../features/speakFirstConversation";
import * as Sentry from "@sentry/browser";

export const useFirstGreeting = () => {
  const { viewer } = useContext(ViewerContext);
  const [firstGreetingDone, setFirstGreetingDone] = useAtom(
    firstGreetingDoneAtom
  );
  const userInfo = useAtomValue(userInfoAtom);
  const textToSpeechApiType = useAtomValue(textToSpeechApiTypeAtom);

  const firstGreeting = useCallback(() => {
    const greet = async () => {
      if (!viewer.model || firstGreetingDone) {
        return;
      }

      try {
        speakFirstConversation({
          viewerModel: viewer.model,
          userName: userInfo?.name || "",
          textToSpeechApiType,
        });
        setFirstGreetingDone(true);
      } catch (error) {
        Sentry.captureException(error);
        console.error(error);
      }
    };

    greet();
  }, [
    viewer.model,
    firstGreetingDone,
    userInfo?.name,
    textToSpeechApiType,
    setFirstGreetingDone,
  ]);

  return {
    firstGreeting,
    firstGreetingDone,
  };
};
