import { NextApiRequest, NextApiResponse } from "next";
import { chat } from "../../features/chat";
import { SituationEnglishConversation } from "../../features/prompts/situationEnglishConversation";
import * as Sentry from "@sentry/node";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    const messages = req.body.messages ?? [];
    const responseData = await chat({
      messages: [
        { role: "system", content: SituationEnglishConversation },
        ...messages,
      ] 
    });
    console.log(responseData);
    res.status(200).json({
      messages: [
        ...messages,
        responseData.choices[0].message,
      ]
    });
  } catch (error: any) {
    Sentry.captureException(error);
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
