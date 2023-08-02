import { NextApiRequest, NextApiResponse } from "next";
import { chat } from "../../features/chat";
import { SYSTEM_PROMPT } from "../../features/prompts";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    const { messages } = req.body;
    const responseData = await chat({ 
      messages,
      systemPrompt: SYSTEM_PROMPT,
    });
    console.log(responseData);
    res.status(200).json({
      messages: [
        ...messages,
        responseData.choices[0].message,
      ]
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
