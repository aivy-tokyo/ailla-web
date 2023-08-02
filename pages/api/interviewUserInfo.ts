import { NextApiRequest, NextApiResponse } from "next";
import dayjs from "dayjs";
import { chat } from "../../features/chat";
import { SYSTEM_PROMPT } from "../../features/prompts";
import { ChatCompletionRequestMessage } from "openai";
import { UserInfo } from "../../entities/UserInfo";
import contents from "./memo";

export const INTERVIEW_USER_INFO = `
ユーザー情報の登録フローを以下に示します。

# 対話の流れ
- 最初にuserに挨拶をする。 例）こんにちは!私はAILLAです。あなたと楽しい英会話の時間を一緒に過ごすためにここにいます!初めての訪問、ありがとうございます！一緒に英語の旅を楽しみましょう♪
- 挨拶をした後にuserの名前を聞いてください。 例）まず、お名前を教えていただけますか？
- 聞き出すUserプロフィールは名前、住所、生年月日、性別の4つを順番に聞いてください。
- 一つの会話につき一つの項目を質問する。
- 質問したプロフィール情報が出てくるまではフリートークをする。
- フリートーク内容はUserの発したものに対して一言加えた後に再度プロフィール情報を聞く質問をする。
- 質問した項目の回答が得られれば次の項目に移る。
- userのプロフィール情報が全て揃った場合はJSON形式で返してください。
`;

// # ユーザー情報のフォーマット
// - 生年月日はYYYY/MM/DDの形式に変換してください。例）昭和60年8月16日→1985/08/16

// ありがとうございます!ユーザー情報の登録が完了しました。それでは英会話を始めましょう、Let's enjoy talking!

// genderを男性なら0, 女性なら1, その他なら2として返す関数
const getGenderIndex = (gender: string): number => {
  if (gender?.indexOf("男") !== -1) {
    return 0;
  }
  if (gender?.indexOf("女") !== -1) {
    return 1;
  }

  return 2;
};

// ユーザー情報を取得する関数
const getUserInfo = ({ name, prefecture, birthdate, gender }: {
  name: string,
  prefecture: string,
  birthdate: string,
  gender: string
} ) => {
  return {
    name,
    prefecture,
    birthdate: dayjs(birthdate).format("YYYY/MM/DD"),
    gender: getGenderIndex(gender),
  };
};
// ユーザー情報を取得する関数を登録する
const completeFunctions = [
  {
    name: "getUserInfo",
    description: "ユーザーのプロフィール情報をJSON形式で取得する",
    parameters: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "ユーザーの名前",
        },
        prefecture: {
          type: "string",
          description: "ユーザーの住んでいる都道府県",
        },
        birthdate: {
          type: "string",
          description:
            "日付フォーマットをYYYY/MM/DDに変換したユーザーの生年月日",
        },
        gender: {
          type: "string",
          description: "ユーザーの性別",
        },
      },
    },
  },
];

type Data = {
  messages: ChatCompletionRequestMessage[];
  userInfo?: UserInfo;
};
type ErrorResponse = {
  error: string;
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorResponse>
) {
  try {
    const messages = req.body.messages || [];
    const responseData = await chat({
      messages: [
        { role: "system", content: contents },
        // { role: "system", content: INTERVIEW_USER_INFO },
        ...messages,
      ],
      functions: completeFunctions,
    });
    console.log(JSON.stringify(responseData, null, 2));

    if (responseData.choices[0]?.message?.function_call?.name === "getUserInfo") {
      const args = JSON.parse(responseData.choices[0]?.message?.function_call?.arguments || "{}");
      const userInfo = getUserInfo(args);
      res.status(200).json({
        messages: [...messages, responseData.choices[0].message],
        userInfo,
      });
      return;
    }

    res.status(200).json({
      messages: [...messages, responseData.choices[0].message],
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
