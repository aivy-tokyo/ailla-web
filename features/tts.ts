import axios, { AxiosResponse } from "axios";
import { Avatar } from "../utils/types";
import * as Sentry from "@sentry/nextjs";

type Params = {
  text: string;
  lang?: 'ja' | 'cn' | string;
  currentAvatar: Avatar;
};

export const tts = async ({
  text,
  lang = 'cn',
  currentAvatar,
}: Params): Promise<ArrayBuffer | undefined> => {
  try {
    let response: AxiosResponse<ArrayBuffer>;

    if(lang === 'cn'){ //中国語ならGoogleTextToSpeechAPI
      const voiceName = currentAvatar.ttsChinese;
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
