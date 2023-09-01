import { NextApiRequest, NextApiResponse } from "next";
import { TextToSpeechClient } from "@google-cloud/text-to-speech";
import * as Sentry from "@sentry/nextjs";

const client = new TextToSpeechClient({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  credentials: JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS as string),
});

// for Japanese
const synthesizeJapaneseSpeech = async (text: string) => {
  const request = {
    audioConfig: {
      audioEncoding: "LINEAR16" as const,
      effectsProfileId: ["small-bluetooth-speaker-class-device"],
      pitch: 8,
    },
    input: {
      text: text,
    },
    voice: {
      languageCode: "ja-JP",
      name: "ja-JP-Neural2-B",
    },
  };
  return await client.synthesizeSpeech(request);
};

// for English
const synthesizeEnglishSpeech = async (text: string) => {
  const request = {
    audioConfig: {
      audioEncoding: "MP3" as const,
      effectsProfileId: ["small-bluetooth-speaker-class-device"],
      pitch: 8,
      speakingRate: 1,
    },
    input: {
      text: text,
    },
    voice: {
      languageCode: "en-US",
      name: "en-US-Neural2-F",
    },
  };
  return await client.synthesizeSpeech(request);
};



const handler = async (req: NextApiRequest, res: NextApiResponse) => {

  const { text, lang = 'en' } = req.body;
  try {
    // sythesize text
    let response;
    switch (lang) {
      case "ja":
        [response] = await synthesizeJapaneseSpeech(text);
        break;
      case "en":
        [response] = await synthesizeEnglishSpeech(text);
        break;
      default:
        throw new Error("Unsupported language");
    }

    // send audio
    res.setHeader("Content-Type", "audio/mpeg");
    res.send(response.audioContent);
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).send(error);
  }
};
export default handler;
