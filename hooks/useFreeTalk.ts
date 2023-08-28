import { useAtomValue, useSetAtom } from "jotai";
import {
  chatLogAtom,
  chatProcessingAtom,
  textToSpeechApiTypeAtom,
  userInfoAtom,
} from "../utils/atoms";
import { ChatCompletionRequestMessage } from "openai";
import { useCallback, useState } from "react";
import axios from "axios";
import { Message } from "../features/messages/messages";
import { speakCharactor } from "../features/speakCharactor";
import { useViewer } from "./useViewer";
import * as Sentry from "@sentry/browser";

export const useFreeTalk = () => {
  const viewer = useViewer();
  const userInfo = useAtomValue(userInfoAtom);
  const textToSpeechApiType = useAtomValue(textToSpeechApiTypeAtom);
  const setChatLog = useSetAtom(chatLogAtom);
  const setChatProcessing = useSetAtom(chatProcessingAtom);

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
      await speakCharactor(
        newMessages[newMessages.length - 1].content,
        viewer.model,
        textToSpeechApiType
      );
    } catch (error) {
      Sentry.captureException(error);
      console.error(error);
    } finally {
      setChatProcessing(false);
    }
  }, [setChatLog, setChatProcessing, textToSpeechApiType, userInfo?.name, viewer.model]);

  const sendMessage = useCallback(
    async (message: string) => {
      if (!viewer.model) return;

      setChatProcessing(true);
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
        await speakCharactor(
          newMessages[newMessages.length - 1].content,
          viewer.model,
          textToSpeechApiType
        );
      } catch (error) {
        Sentry.captureException(error);
        console.error(error);
      } finally {
        setChatProcessing(false);
      }
    },
    [viewer.model, setChatProcessing, setChatLog, userInfo?.name, messages, textToSpeechApiType]
  );

  return {
    topic,
    messages,
    startFreeTalk,
    sendMessage,
  };
};
