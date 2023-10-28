import * as Sentry from "@sentry/nextjs";
import { useAtomValue } from "jotai";
import { useContext, useCallback, useRef, useState } from "react";
import { ViewerContext } from "../features/vrmViewer/viewerContext";
import { clientInfoAtom, userInfoAtom } from "../utils/atoms";
import { useCharactorSpeaking } from "./useCharactorSpeaking";

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

const lessonsStartPhrases = [
  "今日はどのレッスンから始めますか？",
  "どのレッスンを最初に進めるといいでしょうか？",
  "どのトピックから学びたいですか？",
  "どのレッスンから授業をスタートしますか？",
  "始めたいレッスンはどれですか？",
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
  const comeBackGreetings = clientInfo?.comeBackGreetings || [];
  const introduction = clientInfo?.introduction || "";

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
          text: replaceUserName(introduction, userName),
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
          Math.random() * comeBackGreetings.length,
        );

        await speakCharactor({
          text: replaceUserName(comeBackGreetings[randomIndex], userName),
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
