import axios, { AxiosResponse } from "axios";
import { Avatar } from "../utils/types";
import * as Sentry from "@sentry/nextjs";

type Params = {
  text: string;
  lang?: 'ja' | 'en' | string;
  currentAvatar: Avatar;
};

export const tts = async ({
  text,
  lang = 'en',
  currentAvatar,
}: Params): Promise<ArrayBuffer | undefined> => {
  try {
    let response: AxiosResponse<ArrayBuffer>;

    if(lang === 'en'){ //英語ならGoogleTextToSpeechAPI
      const voiceName = currentAvatar.ttsEnglish
      response = await axios.post('/api/synthesize', {
        text,
        voiceName,
      }, {
        headers: { 'Content-Type': 'application/json' },
        responseType: "arraybuffer",
      });

      return response.data;
    }else if(lang === 'ja'){ //日本語ならClovaVoiceAPI
      const speaker = currentAvatar.ttsJapanese
      response = await axios.post('/api/clova-voice', {
        text,
        speaker,
      }, {
        headers: { 'Content-Type': 'application/json' },
        responseType: "arraybuffer",
      });

      return response.data;
    }else {
      console.error('Unsupported language');
        return undefined;
    }
  } catch (error) {
    Sentry.captureException(error);
  }
};
