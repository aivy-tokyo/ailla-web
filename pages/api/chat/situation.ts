import { NextApiRequest, NextApiResponse } from "next";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";
import { ChatCompletionRequestMessage } from "openai";

const chat = new ChatOpenAI({
  modelName: "gpt-3.5-turbo",
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

// prompt textを生成する
// 引数: topic - トピック, messages - 会話の配列, userName - ユーザー名
// 返り値: prompt text
const generatePromptText = async ({
  topic,
  messages,
  userName,
}: {
  topic: string;
  messages: ChatCompletionRequestMessage[];
  userName: string;
}) => {
  const promptForIceBreak = await promptTemplateForIceBreak.format({
    topic,
    userName,
  });
  const conversation =
    messages
      .map((message) => {
        if (message.role === "user") {
          return `${userName}: ${message.content}`;
        }
        if (message.role === "system") {
          return `システム: ${message.content}`;
        }
        if (message.role === "assistant") {
          return `AILLA: ${message.content}`;
        }
        return "";
      })
      .join("\n") + "\nAILLA: ";

  return `${promptForIceBreak}${conversation}`;
};

// OpenAI APIを使ってIceBreakの会話をする
// 引数: messages - 会話の配列
// 返り値: 会話の配列
type Parameter = {
  userName: string;
  messages: ChatCompletionRequestMessage[];
  topic: string;
};

// Path: pages/api/chat/ice-break.ts
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    | {
        topic: string;
        message: string;
      }
    | { error: string }
  >
) {
  console.log(req.body);
  try {
    const topic = (req.body as Parameter).topic ?? getRandomPickuoTopic();
    const userName = (req.body as Parameter).userName ?? "you";
    const messages = (req.body as Parameter).messages ?? [];
    const promptText = await generatePromptText({
      topic,
      messages,
      userName,
    });
    const responseMessage = await chat.predict(promptText);

    res.status(200).json({
      topic,
      message: responseMessage,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
