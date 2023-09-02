import { TextToSpeechApiType } from "../utils/types";
import { speakCharactor } from "./speakCharactor";
import { Model } from "./vrmViewer/model";
import * as Sentry from "@sentry/nextjs";

const introductionGreeting = `Hi {UserName}! I'm AILLA, your English conversation partner. Let's have a fun and engaging chat together!`;
const appExplanation = `
このアプリでは、AILLAと英語で会話をすることができます。
英会話の練習には3つのモードがあります。
1. フリートークモード
2. シチュエーションモード
3. リピートプラクティスモード
フリートークモードでは、自由に会話をすることができます。
シチュエーションモードでは、シチュエーションに沿った会話をすることができます。
リピートプラクティスモードでは、AILLAが英語を話すので、それを聞いてリピートすることで発音の練習をすることができます。
モードを選択すると、会話が始まります。
さあ、はじめましょう！!
`;

const comeBackGreetingList = [
  "Welcome back! It's great to see you again. Ready for another exciting lesson?",
  "Hi {UserName}! I hope you had a great week. Let's continue our English journey together!",
  "Good to see you again, {UserName}! I'm looking forward to hearing about your progress.",
  "Hello {UserName}! How have you been? Let's make today's lesson another success!",
  "Welcome back, {UserName}! Your hard work is really paying off. Let's keep it up!",
];
const lessonsStartPhrases = [
  "今日は何から始めたいと思いますか？どのレッスンにしましょうか？",
  "今日のレッスンはどれから手をつけましょうか？",
  "今日はどのトピックから学び始めるのがいいと思いますか？",
  "どのレッスンから今日の授業を始めたいですか？",
  "今日の始めたいレッスンは何ですか？どれから進めましょうか？"
];

// UserNameをユーザー名に置き換える
const replaceUserName = (text: string, userName: string) => {
  return text.replace("{UserName}", userName);
};

// アプリ起動時の初回発話をする
type Params = {
  viewerModel: Model;
  userName: string;
  textToSpeechApiType: TextToSpeechApiType;
  onSpeaking?: (text: string) => void;
  onSpeakingEnd?: () => void;
}
export const speakFirstConversation = async ({
  viewerModel,
  userName,
  textToSpeechApiType,
  onSpeaking,
  onSpeakingEnd,
}: Params) => {
  try {
    // localStorageからisAppExplanationDoneを取得
    const isAppExplanationDone = localStorage.getItem("isAppExplanationDone");

    if (!isAppExplanationDone) {
      // アプリの説明をしていない場合は、はじめましての挨拶とアプリの説明をする
      await speakCharactor(
        replaceUserName(introductionGreeting, userName),
        viewerModel,
        textToSpeechApiType,
        'en',
        onSpeaking,
        onSpeakingEnd,
      );
      await speakCharactor(
        replaceUserName(appExplanation, userName),
        viewerModel,
        textToSpeechApiType,
        'ja',
        onSpeaking,
        onSpeakingEnd,
      );
      localStorage.setItem("isAppExplanationDone", "true");
    } else {
      // アプリの説明をしている場合は、アイスブレイクの会話をする
      const randomIndex = Math.floor(
        Math.random() * comeBackGreetingList.length
      );
      await speakCharactor(
        replaceUserName(
          comeBackGreetingList[randomIndex],
          userName
        ),
        viewerModel,
        textToSpeechApiType,
        'en',
        onSpeaking,
        onSpeakingEnd,
      );
      await speakCharactor(
        lessonsStartPhrases[randomIndex],
        viewerModel,
        textToSpeechApiType,
        'ja',
        onSpeaking,
        onSpeakingEnd,
      );
    }
    viewerModel.orderedToSkip = false;
  } catch (error) {
    Sentry.captureException(error);
  }
};
