import { Model } from "../features/vrmViewer/model";
import { useCallback, useEffect } from "react";
import { tts } from "../features/tts";
import * as Sentry from "@sentry/nextjs";
import { useAtomValue, useSetAtom } from "jotai";
import {
  currentAvatarAtom,
  isCharactorSpeakingAtom,
  clientInfoAtom,
} from "../utils/atoms";
import { useViewer } from "./useViewer";

type Props = {
  text: string;
  viewerModel: Model;
  language: string;
  onSpeaking?: (text: string) => void;
  onSpeakingEnd?: () => void;
};

export const useCharactorSpeaking = () => {
  const viewer = useViewer();
  const currentAvatar = useAtomValue(currentAvatarAtom);
  const setIsCharactorSpeaking = useSetAtom(isCharactorSpeakingAtom);
  const clientInfo = useAtomValue(clientInfoAtom);
  const formalLanguage = clientInfo?.formalLanguage || "";

  useEffect(() => {
    document.addEventListener(
      "click",
      () => {
        viewer?.model?.resumeAudio();
      },
      { once: true },
    );
  }, [viewer?.model]);

  const speakCharactor = useCallback(
    async ({
      text,
      viewerModel,
      language,
      onSpeaking,
      onSpeakingEnd,
    }: Props) => {
      console.log("speak:", text);
      setIsCharactorSpeaking(true);

      try {
        viewerModel.resumeAudio();
        const buffer = await tts({
          text,
          language,
          formalLanguage,
          currentAvatar,
        });
        if (!buffer) {
          return;
        }

        if (onSpeaking) {
          onSpeaking(text);
        }
        await viewerModel.speak(buffer, { expression: "happy" });
        if (onSpeakingEnd) {
          onSpeakingEnd();
        }

        viewerModel.emoteController?.playEmotion("relaxed");
      } catch (error) {
        Sentry.captureException(error);
      } finally {
        setTimeout(() => {
          setIsCharactorSpeaking(false);
        }, 500);
      }
    },
    [currentAvatar, clientInfo, setIsCharactorSpeaking],
  );

  return {
    speakCharactor,
  };
};
