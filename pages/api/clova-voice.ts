import axios, { AxiosError } from "axios";
import { NextApiRequest, NextApiResponse } from "next";

const ENDPOINT_URL = "https://naveropenapi.apigw.ntruss.com/tts-premium/v1/tts";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { text, lang = "en" } = req.body;
    const response = await axios.post(
      ENDPOINT_URL,
      {
        speaker: lang === "en" ? "danna" : "driko",
        text: text,
        format: "mp3",
        speed: 0,
        alpha: -2,
        pitch: -4,
      } as ClovaAPI.Voice.RequestBody,
      {
        headers: {
          "X-NCP-APIGW-API-KEY-ID":
            process.env.NEXT_PUBLIC_CLOVA_VOICE_CLIENT_ID,
          "X-NCP-APIGW-API-KEY":
            process.env.NEXT_PUBLIC_CLOVA_VOICE_CLIENT_SECRET,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        responseType: "arraybuffer",
      }
    );

    // レスポンスをクライアントに転送
    res.status(200).send(response.data);
  } catch (error) {
    const axiosError = error as AxiosError;
    res
      .status(axiosError.response?.status || 500)
      .json(axiosError.response?.data || {});
  }
}
