import { useAtomValue, useSetAtom } from "jotai";
import {
  chatLogAtom,
  textToSpeechApiTypeAtom,
  userInfoAtom,
} from "../utils/atoms";
import { ChatCompletionRequestMessage } from "openai";
import { useCallback, useState } from "react";
import axios from "axios";
import { Message } from "../features/messages/messages";
import { useViewer } from "./useViewer";
import * as Sentry from "@sentry/nextjs";
import { useCharactorSpeaking } from "./useCharactorSpeaking";

export const useFreeTalk = () => {
  const viewer = useViewer();
  const userInfo = useAtomValue(userInfoAtom);
  const textToSpeechApiType = useAtomValue(textToSpeechApiTypeAtom);
  const setChatLog = useSetAtom(chatLogAtom);
  const {speakCharactor} = useCharactorSpeaking();

  const [topic, setTopic] = useState<string>("");
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);

  const startFreeTalk = useCallback(async () => {
    if (!viewer.model) return;

    try {
      setMessages([]);
      const response = await axios.post("/api/chat/free-talk", {
        userName: userInfo?.name,
        messages: [],
      });
      console.log("response->", response);
      const { topic, messages: newMessages } = response.data;
      console.log("newMessages->", newMessages);
      setTopic(topic);
      setMessages(newMessages);
      setChatLog((prev) => [...prev, newMessages[newMessages.length - 1]]);
      await speakCharactor({
        text: newMessages[newMessages.length - 1].content,
        viewerModel: viewer.model,
        textToSpeechApiType,
      });
    } catch (error) {
      Sentry.captureException(error);
    }
  }, [setChatLog, speakCharactor, textToSpeechApiType, userInfo?.name, viewer.model]);

  const sendMessage = useCallback(
    async (message: string) => {
      if (!viewer.model || !message.trim()) return;

      try {
        const userMessage: Message = {
          role: "user",
          content: message,
        };
        console.log("userMessage->", userMessage);
        setChatLog((prev) => [...prev, userMessage]);
        const response = await axios.post("/api/chat/free-talk", {
          userName: userInfo?.name,
          messages: [...messages, userMessage],
        });
        console.log("response->", response);
        const { topic, messages: newMessages } = response.data;
        console.log("newMessages->", newMessages);
        setTopic(topic);
        setMessages(newMessages);
        setChatLog((prev) => [...prev, newMessages[newMessages.length - 1]]);
        await speakCharactor({
          text: newMessages[newMessages.length - 1].content,
          viewerModel: viewer.model,
          textToSpeechApiType,
        });
      } catch (error) {
        Sentry.captureException(error);
      }
    },
    [viewer.model, setChatLog, userInfo?.name, messages, speakCharactor, textToSpeechApiType]
  );

  return {
    topic,
    messages,
    startFreeTalk,
    sendMessage,
  };
};