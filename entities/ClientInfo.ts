export interface ClientInfo {
  // クライアントコード
  code: string;
  // 省略言語
  language: "cn" | "en" | "ja";
  // 正式言語
  formalLanguage: "zh-CN" | "en-US" | "ja-JP";
  // 学習言語
  learningLanguage: "中国語" | "英語" | "日本語";
  // 話してほしい言語
  speakLanguage: "北京語" | "英語" | "日本語";
  // シチュエーションリスト
  situationList: string[];
  // 導入時の挨拶
  introduction: string;
  // topics
  topics: Record<string, string>;
  // ログイン後の挨拶リスト
  comeBackGreetings: string[];
  // AzureのSpeech ServiceのAPIキー
  speechApiKey: string;
  // AzureのSpeech Serviceのエンドポイント
  speechEndpoint: string;
}
