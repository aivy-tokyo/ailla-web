import * as Sentry from "@sentry/nextjs";
import { useAtomValue } from "jotai";
import { useContext, useCallback, useRef } from "react";
import { ViewerContext } from "../features/vrmViewer/viewerContext";
import { userInfoAtom } from "../utils/atoms";
import { useCharactorSpeaking } from "./useCharactorSpeaking";

const introductionGreeting = `你好 {UserName}! 我是艾拉, 你的中文对话伙伴。让我们一起来一场有趣又有趣的聊天吧！`;
const appExplanation = `
このアプリでは、
Aillaと中国語で会話をすることができます。
中国語会話の練習には3つのモードがあります。

1. フリートークモード。
2. シチュエーションモード。
3. リピートプラクティスモード。

フリートークモードでは、
自由に会話をすることができます。
シチュエーションモードでは、
シチュエーションに沿った会話をすることができます。

リピートプラクティスモードでは、
Aillaが中国語を話すので、
それを聞いてリピートすることで発音の練習をすることができます。
モードを選択すると、
会話が始まります。

さあ、はじめましょう！!
`;

const comeBackGreetingList = [
  "欢迎回来！很高兴再次见到你。准备好学习另一堂激动人心的课程了吗？",
  "你好 {UserName}! 我希望你度过了愉快的一周。让我们一起继续我们的中国之旅！",
  "很高兴再次见到你, {UserName}! 我期待听到您的进展。",
  "你好 {UserName}! 你最近怎么样？让我们今天的课程再创成功吧！",
  "欢迎回来, {UserName}! 你的努力确实得到了回报。让我们继续努力吧！",
];
const lessonsStartPhrases = [
  "今日は何から始めたいと思いますか？どのレッスンにしましょうか？",
  "今日のレッスンはどれから手をつけましょうか？",
  "今日はどのトピックから学び始めるのがいいと思いますか？",
  "どのレッスンから今日の授業を始めたいですか？",
  "今日の始めたいレッスンは何ですか？どれから進めましょうか？",
];

// UserNameをユーザー名に置き換える
const replaceUserName = (text: string, userName: string) => {
  return text.replace("{UserName}", userName);
};

// アプリ起動時の初回発話をする
export const useFirstConversation = (props: {
  onSpeaking?: (text: string) => void;
  onSpeakingEnd?: () => void;
}) => {
  const { viewer } = useContext(ViewerContext);
  const userInfo = useAtomValue(userInfoAtom);
  const { speakCharactor } = useCharactorSpeaking();
  // speakを継続するかどうかのフラグ
  const isSpeaking = useRef(true);

  const speak = useCallback(async () => {
    if (!viewer.model || !userInfo) return;

    const userName = userInfo.name;
    const viewerModel = viewer.model;
    const { onSpeaking, onSpeakingEnd } = props;

    try {
      // localStorageからisAppExplanationDoneを取得
      const isAppExplanationDone = localStorage.getItem("isAppExplanationDone");

      if (!isAppExplanationDone) {
        // アプリの説明をしていない場合は、はじめましての挨拶とアプリの説明をする
        if (!isSpeaking.current) {
          return;
        }
        
        await speakCharactor({
          text: replaceUserName(introductionGreeting, userName),
          viewerModel,
          onSpeaking,
          onSpeakingEnd,
        });

        if (!isSpeaking.current) {
          return;
        }

        await speakCharactor({
          text: replaceUserName(appExplanation, userName),
          viewerModel,
          lang: "ja",
          onSpeaking,
          onSpeakingEnd,
        });
        localStorage.setItem("isAppExplanationDone", "true");
      } else {
        // アプリの説明をしている場合は、アイスブレイクの会話をする
        if (!isSpeaking.current) {
          return;
        }

        const randomIndex = Math.floor(
          Math.random() * comeBackGreetingList.length
        );
        await speakCharactor({
          text: replaceUserName(comeBackGreetingList[randomIndex], userName),
          viewerModel,
          onSpeaking,
          onSpeakingEnd,
        });

        if (!isSpeaking.current) {
          return;
        }

        await speakCharactor({
          text: lessonsStartPhrases[randomIndex],
          viewerModel,
          lang: "ja",
          onSpeaking,
          onSpeakingEnd,
        });
      }
    } catch (error) {
      Sentry.captureException(error);
    }
  }, [viewer.model, userInfo, props, speakCharactor]);

  const stopSpeaking = useCallback(() => {
    viewer.model?.stopSpeak();
    isSpeaking.current = false;
  }, [viewer.model]);

  return {
    speak,
    stopSpeaking,
  };
};
