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
  template: `あなたは英会話の教師です。あなたの名前はAILLA。生徒の名前は{userName}。英会話の授業を始める前のアイスブレイク会話をしてください。トピックは{topic}です。会話は100文字におさめてください。会話はかならず英語で行ってください。`,
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

// Function: search UserName, and extract text before UserName.
// ex) text: "Hello, I'm AILLA. What's your name? USER: My name is John. AILLA: Nice to meet you, John. Let's start the lesson."
// UserName: "USER:"
// return: "Hello, I'm AILLA. What's your name? "
export const extractTextBeforeUserName = (text: string, userName: string) => {
  const userNameIndex = text.indexOf(userName);
  if (userNameIndex === -1) {
    return text;
  }
  return text.slice(0, userNameIndex);
};

// MEMO:【バグ対策】2役の返答が帰ってきた場合にAILLA側の返答のみを取得する処理
const avoidReturnTwoRoles = (responseMessage: string) => {
  console.log('responseMessage->', responseMessage);

  //"AILLA: XXXXXX User: XXXXXX ~~~"のパターン
  const matchPattern1 = responseMessage.match(/AILLA:\s*([^]+?)\s*User:/);
  if(matchPattern1 && matchPattern1[1]) {
    console.log("[!WARNING!]:Two roles responded (matchPattern1))")
    return matchPattern1[1];
  }

  //"XXXXXX User: XXXXXX ~~~"のパターン
  const matchPattern2 = responseMessage.match(/^([^]+?)\s*User:/);
  if(matchPattern2 && matchPattern2[1]) {
    console.log("[!WARNING!]:Two roles responded (matchPattern2))")
    return matchPattern2[1];
  }
  return responseMessage;
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
    const userName = ((req.body as Parameter).userName ?? "you").toUpperCase();
    const messages = (req.body as Parameter).messages ?? [];
    const promptText = await generatePromptText({
      topic,
      messages,
      userName,
    });
    const chatMessage = await chat.predict(promptText);
    console.log("chatMessage->", chatMessage);
    const assistantMessage = extractTextBeforeUserName(
      chatMessage,
      `${userName}:`
    );
    console.log("assistantMessage->", assistantMessage);

    //2役の返答が帰ってきた場合にAILLA側の返答のみを取得する
    const processedAssistantMessage = avoidReturnTwoRoles(assistantMessage);

    res.status(200).json({
      topic,
      messages: [
        ...messages,
        {
          role: "assistant",
          content: processedAssistantMessage,
        },
      ],
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
