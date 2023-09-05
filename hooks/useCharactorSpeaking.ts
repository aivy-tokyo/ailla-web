import { Model } from "../features/vrmViewer/model";
import { useCallback } from "react";
import { TextToSpeechApiType } from "../utils/types";
import { tts } from "../features/tts";
import * as Sentry from "@sentry/nextjs";
import { useSetAtom } from "jotai";
import { isCharactorSpeakingAtom } from "../utils/atoms";

type Props = {
  text: string;
  viewerModel: Model;
  textToSpeechApiType: TextToSpeechApiType;
  lang?: string;
  onSpeaking?: (text: string) => void;
  onSpeakingEnd?: () => void;
}

export const useCharactorSpeaking = () => {
  const setIsCharactorSpeaking = useSetAtom(isCharactorSpeakingAtom);

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
        const buffer = await tts({ text, textToSpeechApiType, lang });
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
        setIsCharactorSpeaking(false);
      }
    }, [setIsCharactorSpeaking]
  );

  return {
    speakCharactor,
  };
};