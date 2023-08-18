import { TextToSpeechApiType } from "../utils/types";
import { tts } from "./tts";
import { Model } from "./vrmViewer/model";

export const speakCharactor = async (
  text: string,
  viewerModel: Model,
  textToSpeechApiType: TextToSpeechApiType,
  lang = "en",
) => {
  console.log("speak:", text);
  try {
    const buffer = await tts({ text, textToSpeechApiType, lang });
    if (!buffer) {
      return;
    }
    await viewerModel.speak(buffer, { expression: "happy" });
    viewerModel.emoteController?.playEmotion("relaxed");
  } catch (error) {
    console.error("Failed to speak:", error);
  }
};