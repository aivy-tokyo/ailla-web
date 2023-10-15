import { NextApiRequest, NextApiResponse } from "next";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";
import { ChatCompletionRequestMessage } from "openai";
import { GPT_MODEL } from "../../../utils/constants";
import * as Sentry from "@sentry/nextjs";

const chat = new ChatOpenAI({
  modelName: GPT_MODEL,
  temperature: 0.7,
  maxTokens: 150,
});

// シチュエーションの会話をするためのSYSTEMのメッセージテンプレート
const situationTemplate = (speakLanguage: string) => {
  const introduction = `あなたは、${speakLanguage}の教師です。次の設定に従って、役になりきって、${speakLanguage}を話してください。`;
  const situationDetails = `設定:[{title}]{situation}`;
  const roleDescription = `あなたは{role}です。{role}側の${speakLanguage}を話してください。`;
  const namingInstruction = `会話の中で名前を名乗る時はAillaと名乗ってください。`;

  return new PromptTemplate({
    template: `${introduction} ${situationDetails} ${roleDescription} ${namingInstruction}`,
    inputVariables: ["title", "situation", "role"],
  });
};

// prompt textを生成する
// 引数: topic - トピック, messages - 会話の配列, userName - ユーザー名
// 返り値: prompt text
const generatePromptText = async ({
  title,
  description: situantion,
  messages,
  role,
  speakLanguage,
}: {
  title: string;
  description: string;
  messages: ChatCompletionRequestMessage[];
  role: string;
  speakLanguage: string;
}) => {
  const systemPrompt = await situationTemplate(speakLanguage).format({
    title: title,
    situation: situantion,
    role: role,
  });
  const conversation =
    messages
      .map((message) => {
        if (message.role === "user") {
          return `Staff: ${message.content}`;
        }
        if (message.role === "system") {
          return `SYSTEM: ${message.content}`;
        }
        if (message.role === "assistant") {
          return `Customer: ${message.content}`;
        }
        return "";
      })
      .join("\n") + "\nCustomer: ";

  return `${systemPrompt}${conversation}`;
};

// 2役の返答が帰ってきた場合にCustomer側の返答のみを取得する処理
const avoidReturnTwoRoles = (responseMessage: string) => {
  console.log("responseMessage->", responseMessage);
  // 北京語の場合はフロントスタッフ、英語の場合はCustomer
  const matchPattern1 = responseMessage.match(
    /^([^]+?)\s*フロントスタッフ:|([^]+?)\s*Customer:/
  );

  if (matchPattern1 && matchPattern1[1]) {
    console.log("[!WARNING!]:Two roles responded.(matchPattern1))");
    return matchPattern1[1];
  }

  const matchPattern2 = responseMessage.match(/^([^]+?)\s*Staff:/);
  if (matchPattern2 && matchPattern2[1]) {
    console.log("[!WARNING!]:Two roles responded.(matchPattern2))");
    return matchPattern2[1];
  }
  return responseMessage;
};

// OpenAI APIを使ってIceBreakの会話をする
// 引数: messages - 会話の配列
// 返り値: 会話の配列
type Parameter = {
  title: string;
  description: string;
  messages: ChatCompletionRequestMessage[];
  role: string;
  speakLanguage: string;
};

// Path: pages/api/chat/situation.ts
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    { messages: ChatCompletionRequestMessage[] } | { error: string }
  >
) {
  try {
    const title = (req.body as Parameter).title ?? "";
    const description = (req.body as Parameter).description ?? "";
    const messages = (req.body as Parameter).messages ?? [];
    const role = (req.body as Parameter).role ?? "";
    const speakLanguage = (req.body as Parameter).speakLanguage ?? "英語";
    const promptText = await generatePromptText({
      title: title,
      description: description,
      messages,
      role: role,
      speakLanguage: speakLanguage,
    });
    const responseMessage = await chat.predict(promptText);
    //2役の返答が帰ってきた場合にCustomer側の返答のみを取得する
    const processedResponseMessage = avoidReturnTwoRoles(responseMessage);
    messages.push({
      role: "assistant",
      content: processedResponseMessage,
    });

    res.status(200).json({
      messages: messages,
    });
  } catch (error: any) {
    Sentry.captureException(error);
    res.status(500).json({ error: error.message });
  }
}
