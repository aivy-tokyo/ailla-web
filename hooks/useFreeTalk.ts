import { useAtomValue, useSetAtom } from "jotai";
import {
  chatLogAtom,
  chatProcessingAtom,
  textToSpeechApiTypeAtom,
} from "../utils/atoms";
import { ChatCompletionRequestMessage } from "openai";
import { useCallback, useState } from "react";
import axios from "axios";
import { Message } from "../features/messages/messages";
import { speakCharactor } from "../features/speakCharactor";
import { useViewer } from "./useViewer";

export const useFreeTalk = () => {
  const viewer = useViewer();
  const textToSpeechApiType = useAtomValue(textToSpeechApiTypeAtom);
  const setChatLog = useSetAtom(chatLogAtom);
  const setChatProcessing = useSetAtom(chatProcessingAtom);

  const [topic, setTopic] = useState<string>("");
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);

  const startFreeTalk = useCallback(() => {
    
    const callFreeTalk = async () => {
      if (!viewer.model) return;

      try {
        setMessages([]);
        const response = await axios.post("/api/chat/free-talk", {
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
        console.error(error);
      } finally {
        setChatProcessing(false);
      }
    };

    callFreeTalk();
  }, [setChatLog, setChatProcessing, textToSpeechApiType, viewer.model]);

  const sendMessage = useCallback(
    async (message: string) => {
      if (!viewer.model) return;

      setChatProcessing(true);
      try {
        const userMessage: Message = {
          role: "user",
          content: message,
        };
        setChatLog((prev) => [...prev, userMessage]);

        const response = await axios.post("/api/chat/free-talk", {
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
        console.error(error);
      } finally {
        setChatProcessing(false);
      }
    },
    [messages, viewer.model, textToSpeechApiType, setChatLog, setChatProcessing]
  );

  return {
    topic,
    messages,
    startFreeTalk,
    sendMessage,
  };
};
