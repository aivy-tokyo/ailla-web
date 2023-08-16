import { NextApiRequest, NextApiResponse } from "next";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";
import { ChatCompletionRequestMessage } from "openai";
import { GPT_MODEL } from "../../../utils/constants";

const chat = new ChatOpenAI({
  modelName: GPT_MODEL,
  temperature: 0.7,
  maxTokens: 150,
});
// TOPICのリスト
const topics = [
  "Hobbies", // Talking about favorite hobbies or interests.
  "Travel", // Sharing experiences from places you've been or want to visit.
  "Food", // Conversations about favorite dishes or restaurants.
  "Movies and Music", // Discussing recent movies watched or favorite musicians.
  "Sports", // Talking about favorite sports or teams.
  "Family", // Light conversation about family members or pets.
  "Recent Events", // Sharing what you did on the last holiday or weekend.
];
const getRandomPickuoTopic = () => {
  return topics[Math.floor(Math.random() * topics.length)];
};

// IceBreakの会話をするためのSYSTEMのメッセージテンプレート
const promptTemplateForIceBreak = new PromptTemplate({
  template: `あなたは英会話の教師です。あなたの名前はAILLA。生徒の名前は{userName}。英会話の授業を始める前のアイスブレイク会話をしてください。トピックは{topic}です。`,
  inputVariables: ["topic", "userName"],
});

const promptTemplateForIceBreakEnd = new PromptTemplate({
  template: `会話を終了する`,
  inputVariables: ["topic", "userName"],
});

// prompt textを生成する
// 引数: topic - トピック, messages - 会話の配列, userName - ユーザー名
// 返り値: prompt text
const generatePromptText = async ({
  topic,
  messages,
  userName,
  end,
}: {
  topic: string;
  messages: ChatCompletionRequestMessage[];
  userName: string;
  end?: boolean;
}) => {
  const promptForIceBreak = end ? await promptTemplateForIceBreakEnd.format({
    topic,
    userName,
  }) : await promptTemplateForIceBreak.format({
    topic,
    userName,
  });
  let conversation = messages.map((message) => {
    if (message.role === "user") {
      return `${userName}: ${message.content}`;
    }
    if (message.role === "system") {
      return `SYSTEM: ${message.content}`;
    }
    if (message.role === "assistant") {
      return `AILLA: ${message.content}`;
    }
    return "";
  }).join("\n");
  // if (end) {
  //   conversation += `\n And start lesson, please`;
  // }
  conversation += "\nAILLA: ";
  console.log(`${promptForIceBreak}${conversation}`);

  return `${promptForIceBreak}${conversation}`;
};

// OpenAI APIを使ってIceBreakの会話をする
// 引数: messages - 会話の配列
// 返り値: 会話の配列
type Parameter = {
  userName: string;
  messages: ChatCompletionRequestMessage[];
  topic?: string;
  end?: boolean;
};

// Path: /api/chat/free-talk
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    | {
        topic: string;
        messages: ChatCompletionRequestMessage[];
      }
    | { error: string }
  >
) {
  try {
    const topic = (req.body as Parameter).topic ?? getRandomPickuoTopic();
    const userName = (req.body as Parameter).userName ?? "you";
    const messages = (req.body as Parameter).messages ?? [];
    const end = (req.body as Parameter).end ?? false;
    const promptText = await generatePromptText({
      topic,
      messages,
      userName,
      end,
    });
    const responseMessage = await chat.predict(promptText);

    res.status(200).json({
      topic,
      messages: [
        ...messages,
        {
          role: "assistant",
          content: responseMessage,
        },
      ],
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
