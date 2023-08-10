import axios, { AxiosError } from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const url = 'https://naveropenapi.apigw.ntruss.com/tts-premium/v1/tts';

        const response = await axios.post(url, req.body, {
          headers: {
            'X-NCP-APIGW-API-KEY-ID': process.env.NEXT_PUBLIC_CLOVA_VOICE_CLIENT_ID,
            'X-NCP-APIGW-API-KEY': process.env.NEXT_PUBLIC_CLOVA_VOICE_CLIENT_SECRET,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          responseType: 'arraybuffer',
        });

        // レスポンスをクライアントに転送
        res.status(200).send(response.data);
    } catch (error) {
        const axiosError = error as AxiosError;
        res.status(axiosError.response?.status || 500).json(axiosError.response?.data || {});
    }
}