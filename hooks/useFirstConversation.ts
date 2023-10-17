import * as Sentry from "@sentry/nextjs";
import { useAtomValue } from "jotai";
import { useContext, useCallback, useRef, useState, useEffect } from "react";
import { ViewerContext } from "../features/vrmViewer/viewerContext";
import { clientInfoAtom, userInfoAtom } from "../utils/atoms";
import { useCharactorSpeaking } from "./useCharactorSpeaking";
import { LanguageKey } from "../utils/constants";

const isLanguageKey = (key: string): key is LanguageKey => {
  return key === "en" || key === "cn";
};

const introductions: Record<LanguageKey, string> = {
  en: `Hello {UserName}! I'm Ailla, your English conversation partner. Let's have a fun and interesting chat together!`,
  cn: `你好 {UserName}！我是艾拉，你的中文对话伙伴。让我们一起来一场有趣又有趣的聊天吧！`,
};

const introductionGreeting = (language: LanguageKey) => {
  return introductions[language] || ""; // Default to an empty string if the language is not found.
};

const appExplanation = (learningLanguage: string) => {
  const explanation: string = `
このアプリでは、
Aillaと${learningLanguage}で会話をすることができます。
会話の練習には3つのモードがあります。

1. フリートークモード。
2. シチュエーションモード。
3. リピートプラクティスモード。

フリートークモードでは、
自由に会話をすることができます。
シチュエーションモードでは、
シチュエーションに沿った会話をすることができます。

リピートプラクティスモードでは、
Aillaが${learningLanguage}を話すので、
それを聞いてリピートすることで発音の練習をすることができます。
モードを選択すると、
会話が始まります。

さあ、はじめましょう！!
  `;

  return explanation;
};

const comeBackGreetings: Record<LanguageKey, string[]> = {
  en: [
    "Welcome back! It's great to see you again. Are you ready for another exciting lesson?",
    "Hello {UserName}! I hope you had a wonderful week. Let's continue our journey through China together!",
    "Nice to see you again, {UserName}! I look forward to hearing about your progress.",
    "Hello {UserName}! How have you been lately? Let's make today's lesson another success!",
    "Welcome back, {UserName}! Your hard work is definitely paying off. Let's keep pushing forward!",
  ],
  cn: [
    // 以下は例です。実際の挨拶を編集してください。
    "欢迎回来！很高兴再次见到你。你准备好进行另一堂激动人心的课了吗？",
    "你好，{UserName}！希望你过得愉快。让我们一起继续在中国的旅程吧！",
    "很高兴再次见到你，{UserName}！期待听到你的进步。",
    "你好，{UserName}！你最近过得怎样？让我们使今天的课程再次成功！",
    "欢迎回来，{UserName}！你的努力肯定会得到回报。让我们继续努力前进！",
  ],
};

const comeBackGreetingList = (language: LanguageKey) =>
  comeBackGreetings[language];

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
  const clientInfo = useAtomValue(clientInfoAtom);
  const language: string =
    clientInfo && clientInfo.language ? clientInfo.language : "en";
  const learningLanguage: string =
    clientInfo && clientInfo.learningLanguage
      ? clientInfo.learningLanguage
      : "英語";

  const { speakCharactor } = useCharactorSpeaking();
  // speakを継続するかどうかのフラグ
  const isSpeaking = useRef(true);

  const speak = useCallback(async () => {
    if (!viewer.model || !userInfo) return;

    const userName = userInfo.name;
    const viewerModel = viewer.model;
    const { onSpeaking, onSpeakingEnd } = props;

    console.log("useFirstConversation language->", language);

    if (!isLanguageKey(language)) {
      return;
    }

    try {
      // localStorageからisAppExplanationDoneを取得
      const isAppExplanationDone = localStorage.getItem("isAppExplanationDone");

      if (!isAppExplanationDone) {
        // アプリの説明をしていない場合は、はじめましての挨拶とアプリの説明をする
        if (!isSpeaking.current) {
          return;
        }

        await speakCharactor({
          text: replaceUserName(introductionGreeting(language), userName),
          viewerModel,
          language,
          onSpeaking,
          onSpeakingEnd,
        });

        if (!isSpeaking.current) {
          return;
        }

        await speakCharactor({
          text: replaceUserName(appExplanation(learningLanguage), userName),
          viewerModel,
          language: "ja",
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
          Math.random() * comeBackGreetingList(language).length
        );

        await speakCharactor({
          text: replaceUserName(
            comeBackGreetingList(language)[randomIndex],
            userName
          ),
          viewerModel,
          language,
          onSpeaking,
          onSpeakingEnd,
        });

        if (!isSpeaking.current) {
          return;
        }

        await speakCharactor({
          text: lessonsStartPhrases[randomIndex],
          viewerModel,
          language: "ja",
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
