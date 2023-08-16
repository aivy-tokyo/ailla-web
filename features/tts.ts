import axios, { AxiosResponse } from "axios";
import { TextToSpeechApiType } from "../utils/types";

type Params = {
  text: string;
  textToSpeechApiType: TextToSpeechApiType;
  lang?: 'ja' | 'en' | string;
};

export const tts = async ({
  text,
  textToSpeechApiType,
  lang = 'en',
}: Params): Promise<ArrayBuffer | undefined> => {
  try {
    let response: AxiosResponse<ArrayBuffer>;

    switch (textToSpeechApiType) {
      case 'googleTextToSpeech':
        response = await axios.post('/api/synthesize', {
          text,
          lang,
        }, {
          headers: { 'Content-Type': 'application/json' },
          responseType: "arraybuffer",
        });
        break;

      case 'clovaVoice':
        response = await axios.post('/api/clova-voice', {
          speaker: 'danna',
          text,
          format: 'mp3',
        }, {
          headers: { 'Content-Type': 'application/json' },
          responseType: "arraybuffer",
        });
        break;

      default:
        console.error('Unsupported textToSpeechApiType:', textToSpeechApiType);
        return undefined;
    }

    return response.data;
  } catch (error) {
    console.error(`Synthesis failed for ${textToSpeechApiType}`, error);
  }
};
