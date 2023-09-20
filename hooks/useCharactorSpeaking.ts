import { Model } from "../features/vrmViewer/model";
import { useCallback, useEffect } from "react";
import { TextToSpeechApiType } from "../utils/types";
import { tts } from "../features/tts";
import * as Sentry from "@sentry/nextjs";
import { useAtomValue, useSetAtom } from "jotai";
import { currentAvatarAtom, isCharactorSpeakingAtom } from "../utils/atoms";
import { useViewer } from "./useViewer";

type Props = {
  text: string;
  viewerModel: Model;
  textToSpeechApiType: TextToSpeechApiType;
  lang?: string;
  onSpeaking?: (text: string) => void;
  onSpeakingEnd?: () => void;
};

export const useCharactorSpeaking = () => {
  const viewer = useViewer();
  const currentAvatar = useAtomValue(currentAvatarAtom);
  const setIsCharactorSpeaking = useSetAtom(isCharactorSpeakingAtom);

  useEffect(() => {
    document.addEventListener(
      "click",
      () => {
        viewer?.model?.resumeAudio();
      },
      { once: true }
    );
  }, [viewer?.model]);

  const speakCharactor = useCallback(
    async ({
      text,
      viewerModel,
      textToSpeechApiType,
      lang = "en",
      onSpeaking,
      onSpeakingEnd,
    }: Props) => {
      console.log("speak:", text);
      setIsCharactorSpeaking(true);
      try {
        viewerModel.resumeAudio();
        const buffer = await tts({ text, textToSpeechApiType, lang, currentAvatar });
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
    [currentAvatar, setIsCharactorSpeaking]
  );

  return {
    speakCharactor,
  };
};
