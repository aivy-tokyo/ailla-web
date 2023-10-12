export interface ClientInfo {
  // 言語　中国語か英語
  language: "cn" | "en";
  // シチュエーションリスト
  situationList: string[];
  // AzureのSpeech ServiceのAPIキー
  speechApiKey: string;
  // AzureのSpeech Serviceのエンドポイント
  speechEndpoint: string;
}
