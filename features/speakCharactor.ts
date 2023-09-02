import { TextToSpeechApiType } from "../utils/types";
import { tts } from "./tts";
import { Model } from "./vrmViewer/model";
import * as Sentry from "@sentry/nextjs";

export const speakCharactor = async (
  text: string,
  viewerModel: Model,
  textToSpeechApiType: TextToSpeechApiType,
  lang = "en",
  onSpeaking?: (text: string) => void,
  onSpeakingEnd?: () => void
) => {
  console.log("speak:", text);
  try {
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
  }
};
