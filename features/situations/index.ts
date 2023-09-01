/**
 * シチュエーションの型定義
 * シチュエーションは、タイトル、説明、ステップからなる
 * ステップは、キーワード、説明、ヒントからなる
 * シチュエーションのタイトル、説明はAIへのシーン設定のプロンプトに使用される
 * ステップのキーワードで会話の流れを制御する
 * ステップの説明とヒントは、ユーザーに表示される
 */
export type Situation = {
  title: string; // シチュエーションのタイトル
  description: string; // シチュエーションの説明
  roleOfAi: string; // AIの役割
  roleOfUser: string; // ユーザーの役割
  steps: {
    // シチュエーションのステップ
    keySentences: string[]; // キーワード
    description: string; // ステップの説明
    hint: string; // ヒント
  }[];
};

export const situationCheckIn: Situation = {
  title: "Check-in",
  description: "ホテルのフロントでチェックインするシーンです。",
  roleOfAi: "Customer",
  roleOfUser: "Staff",
  steps: [
    {
      keySentences: ["reservation", "name"],
      description: "まずは名前を確認しよう",
      hint: "May I have your reservation name, please?",
    },
    {
      keySentences: ["type", "room"],
      description: "次に部屋のタイプを確認しよう",
      hint: "What type of room did you book?",
    },
    {
      keySentences: ["passport", "identification"],
      description: "次に身分証明書を確認しよう",
      hint: "For check-in, we require either a passport or identification card. Do you have it with you?",
    },
    {
      keySentences: ["payment"],
      description: "次に支払い方法を確認しよう",
      hint: "How would you like to settle the payment?",
    },
    {
      keySentences: ["room", "number"],
      description: "最後に部屋番号を伝えよう",
      hint: "Your room number is 1234. The elevator is over there.",
    },
  ],
};
