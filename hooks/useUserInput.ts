import { useRef, useEffect, useState, useCallback } from "react";
import { ChatMode } from "../utils/types";
import { isTranslatedAtom } from "../utils/atoms";
import { useAtomValue } from "jotai";

export const useUserInput = () => {
  const isTranslated = useAtomValue(isTranslatedAtom);

  const speechRecognition = useRef<SpeechRecognition | null>();
  const [chatMode, setChatMode] = useState<ChatMode>("mic");
  const [isMicRecording, setIsMicRecording] = useState<boolean>(false);
  const [userMessage, setUserMessage] = useState<string>("");

  useEffect(() => {
    const SpeechRecognition =
      window.webkitSpeechRecognition || window.SpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.lang = isTranslated ? "ja-JP" : "en-US"; // 言語を指定する
    recognition.interimResults = true; // 途中経過を取得する
    recognition.continuous = true; // 連続的に音声認識を行う
    recognition.maxAlternatives = 1; // 1つの認識結果のみを取得する

    const startHandle = (event: Event) => {
      console.log("start", event);
      setUserMessage("");
      setIsMicRecording(true);
    };
    recognition.addEventListener("start", startHandle);

    const errorHandle = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === "no-speech") {
        console.log("no-speech");
        return;
      }
      console.error("error", event);
    };
    recognition.addEventListener("error", errorHandle);

    const resultHandle = (event: SpeechRecognitionEvent) => {
      console.log("result", event);
      const lastIndexOfResultList = event.results.length - 1;
      const text = event.results[lastIndexOfResultList][0].transcript;

      setUserMessage(text);
    };
    recognition.addEventListener("result", resultHandle);

    const endHandle = (event: Event) => {
      console.log("end", event);
      setIsMicRecording(false);
    };
    recognition.addEventListener("end", endHandle);

    speechRecognition.current = recognition;

    return () => {
      recognition.removeEventListener("start", startHandle);
      recognition.removeEventListener("error", errorHandle);
      recognition.removeEventListener("result", resultHandle);
      recognition.removeEventListener("end", endHandle);
      speechRecognition.current = null;
    };
  }, [isTranslated]);

  const handleStartRecording = useCallback(() => {
    speechRecognition.current?.start();
  }, [speechRecognition]);

  const handleStopRecording = useCallback(async () => {
    speechRecognition.current?.stop();
  }, [speechRecognition]);

  return {
    chatMode,
    setChatMode,
    isMicRecording,
    userMessage,
    setUserMessage,
    handleStartRecording,
    handleStopRecording,
  };
};
