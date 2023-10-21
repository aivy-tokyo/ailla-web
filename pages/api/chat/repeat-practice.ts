import { NextApiRequest, NextApiResponse } from "next";
import { PromptTemplate } from "langchain/prompts";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { ChatCompletionRequestMessage } from "openai";
import { GPT_MODEL } from "../../../utils/constants";
import * as Sentry from "@sentry/nextjs";

// シチュエーションの会話をするためのSYSTEMのメッセージテンプレート
const promptTemplate = new PromptTemplate({
  template: `あなたは、英会話の教師です。次の設定に従って、役になりきって、英語を話してください。設定:[{title}]{repeatPractice}あなたは{role}です。{role}側の英語を話してください。会話の中で名前を名乗る時はAillaと名乗ってください。`,
  inputVariables: ["title", "repeatPractice","role"],
});

const chat = new ChatOpenAI({
  modelName: GPT_MODEL,
  temperature: 0.7,
  maxTokens: 150,
});

const generatePromptText = async({
  title,
  description: repeatPractice,
  messages,
  role,
}: {
  title: string;
  description: string;
  messages: ChatCompletionRequestMessage[];
  role: string;
}) => {
  const systemPrompt = await promptTemplate.format({
    title,
    repeatPractice,
    role,
  });

  const conversation = messages.map((message) => {
    switch (message.role) {
      case "user":
        return `Staff: ${message.content}`;
      case "system":
        return `SYSTEM: ${message.content}`;
      case "assistant":
        return `Customer: ${message.content}`;
      default:
        return "";
    }
  }).join("\n") + "\nCustomer: ";

  return `${systemPrompt}${conversation}`;
};

const avoidReturnTwoRoles = (responseMessage: string) => {
  console.log(`responseMessage: ${responseMessage}`);

  const matchPattern1 = responseMessage.match(/Customer:\s*([^]+?)\s*Staff:/);
  if(matchPattern1 && matchPattern1[1]) {
    console.warn("[!WARNING!]:Two roles responded.(matchPattern1))")
    return matchPattern1[1];
  }

  const matchPattern2 = responseMessage.match(/^([^]+?)\s*Staff:/);
  if(matchPattern2 && matchPattern2[1]) {
    console.warn("[!WARNING!]:Two roles responded.(matchPattern2))")
    return matchPattern2[1];
  }

  return responseMessage;
};

type Parameter = {
  title: string;
  description: string;
  messages: ChatCompletionRequestMessage[];
  role: string;
};

// Path: pages/api/chat/repeat-practice
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    | { messages: ChatCompletionRequestMessage[] }
    | { error: string }
  >
) {
  try {
    const title = (req.body as Parameter).title ?? "";
    const description = (req.body as Parameter).description ?? "";
    const messages = (req.body as Parameter).messages ?? [];
    const role = (req.body as Parameter).role ?? "";
    const promptText = await generatePromptText({
      title,
      description,
      messages,
      role,
    });
    const responseMessage = await chat.predict(promptText);
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
};
