import { useCallback, useContext, useEffect } from "react";
import { ViewerContext } from "../features/vrmViewer/viewerContext";
import { useUserInfo } from "./useUserInfo";
import { Viewer } from "../features/vrmViewer/viewer";
import { tts } from "../features/tts";
import { textToSpeechApiTypeAtom } from "../utils/atoms";
import { useAtomValue } from "jotai";
import { TextToSpeechApiType } from "../utils/types";

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

// ttsを呼び出して、挨拶をする
const speak = async (
  text: string,
  viewer: Viewer,
  textToSpeechApiType: TextToSpeechApiType,
  lang = "en",
) => {
  console.log("speak:", text);
  try {
    const buffer = await tts({ text, textToSpeechApiType, lang });
    if (!buffer) {
      return;
    }
    await viewer.model?.speak(buffer, { expression: "happy" });
  } catch (error) {
    console.error("Failed to speak:", error);
  }
};

// 初回会話の内容を返す
// アプリの説明をしていない場合は、はじめましての挨拶とアプリの説明をする
// アプリの説明をしている場合は、アイスブレイクの会話をする
export const useFirstConversation = () => {
  const { viewer } = useContext(ViewerContext);
  const textToSpeechApiType = useAtomValue(textToSpeechApiTypeAtom);

  // ユーザー情報を取得
  const { userInfo } = {userInfo:{name: 'TARO'}};

  // 初回会話の内容を話す
  const speakFirstConversation = useCallback(async () => {
    if (!viewer || !userInfo) {
      return;
    }

    const handleFirstConversation = async (): Promise<void> => {
      try {
        // localStorageからisAppExplanationDoneを取得
        const isAppExplanationDone = localStorage.getItem("isAppExplanationDone");

        if (!isAppExplanationDone) {
          // アプリの説明をしていない場合は、はじめましての挨拶とアプリの説明をする
          await speak(
            replaceUserName(introductionGreeting, userInfo.name),
            viewer,
            textToSpeechApiType
          );
          await speak(
            replaceUserName(appExplanation, userInfo.name),
            viewer,
            textToSpeechApiType,
            'ja'
          );
          localStorage.setItem("isAppExplanationDone", "true");
        } else {
          // アプリの説明をしている場合は、アイスブレイクの会話をする
          const randomIndex = Math.floor(
            Math.random() * comeBackGreetingList.length
          );
          await speak(
            replaceUserName(
              comeBackGreetingList[randomIndex],
              userInfo.name
            ),
            viewer,
            textToSpeechApiType
          );
          await speak(
            lessonsStartPhrases[randomIndex],
            viewer,
            textToSpeechApiType,
            'ja'
          );
        }
      } catch (error) {
        console.error("Failed to speak:", error);
      }
    };

    handleFirstConversation();
  }, [viewer, userInfo, textToSpeechApiType]);

  return { speakFirstConversation };
};
