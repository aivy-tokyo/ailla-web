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
const promptTemplate = new PromptTemplate({
  template: `あなたは、英会話の教師です。次の設定に従って、役になりきって、英語を話してください。設定:[{title}]{situation}あなたはCustomerです。Customer側の英語を話してください。`,
  inputVariables: ["title", "situation"],
});

// prompt textを生成する
// 引数: topic - トピック, messages - 会話の配列, userName - ユーザー名
// 返り値: prompt text
const generatePromptText = async ({
  title,
  description: situantion,
  messages,
}: {
  title: string;
  description: string;
  messages: ChatCompletionRequestMessage[];
}) => {
  const systemPrompt = await promptTemplate.format({
    title: title,
    situation: situantion,
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

// OpenAI APIを使ってIceBreakの会話をする
// 引数: messages - 会話の配列
// 返り値: 会話の配列
type Parameter = {
  title: string;
  description: string;
  messages: ChatCompletionRequestMessage[];
};

// Path: pages/api/chat/situation.ts
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    | { messages: ChatCompletionRequestMessage[]; }
    | { error: string }
  >
) {
  try {
    const title = (req.body as Parameter).title ?? "";
    const description = (req.body as Parameter).description ?? "";
    const messages = (req.body as Parameter).messages ?? [];
    const promptText = await generatePromptText({
      title: title,
      description: description,
      messages,
    });
    const responseMessage = await chat.predict(promptText);
    // responseMessageに「Customer:」が出現する場合
    const customerIndex = responseMessage.lastIndexOf("Customer:");
    if (customerIndex !== -1) {
      // 最後に出現する「Customer:」以降を取り出す
      const customerMessage = responseMessage.slice(customerIndex);
      // 会話の配列に追加する
      messages.push({
        role: "assistant",
        content: customerMessage,
      });
    } else {
      // それ以外の場合は、responseMessageをそのまま返す
      messages.push({
        role: "assistant",
        content: responseMessage,
      });
    }
      

    res.status(200).json({
      messages: messages,
    });
  } catch (error: any) {
    Sentry.captureException(error);
    res.status(500).json({ error: error.message });
  }
}
