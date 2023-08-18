import { useAtomValue, useSetAtom } from "jotai";
import {
  chatLogAtom,
  chatProcessingAtom,
  textToSpeechApiTypeAtom,
} from "../utils/atoms";
import { ChatCompletionRequestMessage } from "openai";
import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Message } from "../features/messages/messages";
import { speakCharactor } from "../features/speakCharactor";
import { useViewer } from "./useViewer";
import { Situation, situationCheckIn } from "../features/situations";

export const useSituationTalk = () => {
  const viewer = useViewer();
  const textToSpeechApiType = useAtomValue(textToSpeechApiTypeAtom);
  const setChatLog = useSetAtom(chatLogAtom);
  const setChatProcessing = useSetAtom(chatProcessingAtom);

  const [situation, setSituation] = useState<Situation | null>();
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);
  const [situationList, setSituationList] = useState<Situation[]>([
    situationCheckIn,
    situationCheckIn,
    situationCheckIn,
    situationCheckIn,
  ]);
  const [nextStepIndex, setNextStepIndex] = useState<number>(0);
  const nextStep = useMemo(
    () => situation?.steps[nextStepIndex],
    [situation, nextStepIndex]
  );

  const startSituationTalk = useCallback(
    async (selectedSituation: Situation) => {
      if (!viewer.model) return;

      try {
        // シチュエーション会話スタート: シチュエーション設定、次のステップ設定
        setSituation(selectedSituation);
        setNextStepIndex(0);
        setMessages([]);

        // 最初のメッセージリクエスト
        const response = await axios.post("/api/chat/situation", {
          title: selectedSituation.title,
          description: selectedSituation.description,
          messages: [],
        });
        console.log("response->", response);
        const { messages: newMessages } = response.data;
        console.log("newMessages->", newMessages);
        setMessages(newMessages);
        setChatLog((prev) => [...prev, newMessages[newMessages.length - 1]]);

        // キャラクター発話
        await speakCharactor(
          newMessages[newMessages.length - 1].content,
          viewer.model,
          textToSpeechApiType
        );
      } catch (error) {
        console.error(error);
      } finally {
        setChatProcessing(false);
      }
    },
    [setChatLog, setChatProcessing, textToSpeechApiType, viewer.model]
  );

  const sendMessage = useCallback(
    async (message: string) => {
      if (!viewer.model || !situation) return;

      setChatProcessing(true);
      try {
        // nextStepのkeySentencesが全てmessageが含まれているかどうかを確認する
        const isAllKeySentencesIncluded = nextStep?.keySentences.every(
          (keySentence) => message.includes(keySentence)
        );
        // 含まれている場合は次のstepに進む
        if (isAllKeySentencesIncluded) {
          setNextStepIndex((prev) => prev + 1);
        }

        // Userメッセージを送信
        const userMessage: Message = {
          role: "user",
          content: message,
        };
        setChatLog((prev) => [...prev, userMessage]);
        const response = await axios.post("/api/chat/situation", {
          title: situation.title,
          description: situation.description,
          messages: [...messages, userMessage],
        });
        console.log("response->", response);
        const { messages: newMessages } = response.data;
        console.log("newMessages->", newMessages);
        setMessages(newMessages);
        setChatLog((prev) => [...prev, newMessages[newMessages.length - 1]]);

        // キャラクターの発話
        await speakCharactor(
          newMessages[newMessages.length - 1].content,
          viewer.model,
          textToSpeechApiType
        );
      } catch (error) {
        console.error(error);
      } finally {
        setChatProcessing(false);
      }
    },
    [
      viewer.model,
      situation,
      setChatProcessing,
      nextStep?.keySentences,
      setChatLog,
      messages,
      textToSpeechApiType,
    ]
  );

  return {
    situation,
    situationList,
    nextStep,
    messages,
    startSituation: startSituationTalk,
    sendMessage,
  };
};
