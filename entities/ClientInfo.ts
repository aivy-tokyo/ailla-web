export interface ClientInfo {
  // 省略言語
  language: "cn" | "en";
  // 正式言語
  formalLanguage: "zh-CN" | "en-US";
  // 学習言語
  learningLanguage: "中国語" | "英語";
  // 話してほしい言語
  speakLanguage: "北京語" | "英語";
  // シチュエーションリスト
  situationList: string[];
  // AzureのSpeech ServiceのAPIキー
  speechApiKey: string;
  // AzureのSpeech Serviceのエンドポイント
  speechEndpoint: string;
}
