// 複数の箇所で使用する型やインターフェースを定義

import { type } from "os";

export type FortuneTellingType =
  | "OVERVIEW"
  | "SUCCESS"
  | "TALENT"
  | "DEPRESSED"
  | "VOCATION"
  | "TODAY";
export type FortuneTellingLabel =
  | "あなたの本質"
  | "あなたの成功方法"
  | "あなたの才能"
  | "落ち込んだ時の対処法"
  | "あなたの適職"
  | "今日のアドバイス";

export interface PidResponse {
  answer: string;
  content_code: string;
  item: string;
  key: string;
  result: string;
  voiceText: string;
}

export type UserStatusType = "free" | "standard" | "premium";

export type Sex = "M" | "F";

export type SelectedLanguageType = "English" | "中文";

export type Prefecture =
  | "北海道"
  | "青森県"
  | "岩手県"
  | "宮城県"
  | "秋田県"
  | "山形県"
  | "福島県"
  | "茨城県"
  | "栃木県"
  | "群馬県"
  | "埼玉県"
  | "千葉県"
  | "東京都"
  | "神奈川県"
  | "新潟県"
  | "富山県"
  | "石川県"
  | "福井県"
  | "山梨県"
  | "長野県"
  | "岐阜県"
  | "静岡県"
  | "愛知県"
  | "三重県"
  | "滋賀県"
  | "京都府"
  | "大阪府"
  | "兵庫県"
  | "奈良県"
  | "和歌山県"
  | "鳥取県"
  | "島根県"
  | "岡山県"
  | "広島県"
  | "山口県"
  | "徳島県"
  | "香川県"
  | "愛媛県"
  | "高知県"
  | "福岡県"
  | "佐賀県"
  | "長崎県"
  | "熊本県"
  | "大分県"
  | "宮崎県"
  | "鹿児島県"
  | "沖縄県"
  | "選択しない";

export type CharactersOfClovaVoice =
  | "shinji"
  | "ntomoko"
  | "nnaomi"
  | "dnaomi_joyful"
  | "dnaomi_formal"
  | "driko"
  | "deriko"
  | "nsayuri"
  | "dhajime"
  | "ddaiki"
  | "dayumu"
  | "dmio"
  | "dsayuri"
  | "dtomoko"
  | "dnaomi";

export type CharactersOfGoogleEnglishTts =
  | "en-GB-Standard-A"
  | "en-GB-Standard-B"
  | "en-GB-Standard-C"
  | "en-GB-Standard-D"
  | "en-GB-Standard-F"
  | "en-US-Polyglot-1"
  | "en-US-Standard-A"
  | "en-US-Standard-B"
  | "en-US-Standard-C"
  | "en-US-Standard-D"
  | "en-US-Standard-E"
  | "en-US-Standard-F"
  | "en-US-Standard-G"
  | "en-US-Standard-H"
  | "en-US-Standard-I"
  | "en-US-Standard-J";

export type CharactersOfGoogleChineseTts =
  | "cmn-CN-Standard-A"
  | "cmn-CN-Standard-B"
  | "cmn-CN-Standard-C"
  | "cmn-CN-Standard-D"
  | "cmn-CN-Wavenet-A"
  | "cmn-CN-Wavenet-B"
  | "cmn-CN-Wavenet-C"
  | "cmn-CN-Wavenet-D"
  | "cmn-TW-Standard-A"
  | "cmn-TW-Standard-B"
  | "cmn-TW-Standard-C"
  | "cmn-TW-Wavenet-A"
  | "cmn-TW-Wavenet-B"
  | "cmn-TW-Wavenet-C";

export interface Avatar {
  label: string;
  path: string;
  ttsEnglish: CharactersOfGoogleEnglishTts;
  ttsChinese: CharactersOfGoogleChineseTts;
  ttsJapanese: CharactersOfClovaVoice;
}
export interface BackgroundImage {
  label: string;
  path: string;
}

export type UserGenderType = "男性" | "女性" | "選択しない";

export type ChatMode = "mic" | "text" | "none";

export type ButtonProps = {
  size?: "sm" | "md" | "lg" | "xl" | undefined;
  type?: "button" | "submit" | "reset" | undefined;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  onMouseDown?: () => void;
  onMouseUp?: () => void;
  onTouchStart?: () => void;
  onTOuchEnd?: () => void;
};

/**
 * シチュエーションの型定義
 * シチュエーションは、タイトル、説明、ステップからなる
 * ステップは、キーワード、説明、ヒントからなる
 * シチュエーションのタイトル、説明はAIへのシーン設定のプロンプトに使用される
 * ステップのキーワードで会話の流れを制御する
 * ステップの説明とヒントは、ユーザーに表示される
 */
export type SituationStep =
  | {
      // シチュエーションのステップ
      keySentences: string[]; // キーワード
      description: string; // ステップの説明
      hint: string; // ヒント
    }
  | {
      keyPhrases: string[]; // キーワード
      description: string; // ステップの説明
      hint: string; // ヒント
    };

export type Situation = {
  title: string; // シチュエーションのタイトル
  description: string; // シチュエーションの説明
  roleOfAi: string; // AIの役割
  roleOfUser: string; // ユーザーの役割
  steps: SituationStep[];
};
