import axios, { AxiosResponse } from "axios";
import { Avatar } from "../utils/types";
import * as Sentry from "@sentry/nextjs";

type Params = {
  text: string;
  language: "ja" | "en" | "cn" | string;
  formalLanguage: string;
  currentAvatar: Avatar;
};

export const tts = async ({
  text,
  language,
  formalLanguage,
  currentAvatar,
}: Params): Promise<ArrayBuffer | undefined> => {
  try {
    let response: AxiosResponse<ArrayBuffer>;

    if (language === "en" || language === "cn") {
      const voiceName =
        language === "en" ? currentAvatar.ttsEnglish : currentAvatar.ttsChinese;

      response = await axios.post(
        "/api/synthesize",
        {
          text,
          voiceName,
          formalLanguage,
        },
        {
          headers: { "Content-Type": "application/json" },
          responseType: "arraybuffer",
        },
      );

      return response.data;
    } else if (language === "ja") {
      //日本語ならClovaVoiceAPI
      const speaker = currentAvatar.ttsJapanese;
      response = await axios.post(
        "/api/clova-voice",
        {
          text,
          speaker,
        },
        {
          headers: { "Content-Type": "application/json" },
          responseType: "arraybuffer",
        },
      );

      return response.data;
    } else {
      console.error("Unsupported language");
      return undefined;
    }
  } catch (error) {
    Sentry.captureException(error);
  }
};
