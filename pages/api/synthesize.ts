// next.js api endpoint function
// endrpoint: /api/synthesize
// method: POST
// body: {
//   text: string,
// }
//
// response: 'Content-Type', 'audio/mpeg'

import { NextApiRequest, NextApiResponse } from "next";
import { TextToSpeechClient } from "@google-cloud/text-to-speech";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const client = new TextToSpeechClient({
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    credentials: JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS as string),
  });

  const { text } = req.body;
  try {
    // sythesize text
    const [response] = await client.synthesizeSpeech({
      audioConfig: {
        audioEncoding: "MP3",
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
    });

    // send audio
    res.setHeader("Content-Type", "audio/mpeg");
    res.send(response.audioContent);
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
};
export default handler;
