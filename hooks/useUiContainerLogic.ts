import { useState, useEffect, useCallback, Context, useContext, useRef } from "react";
import { useEnglishChat } from "@/hooks/useEnglishChat";
import { ViewerContext } from "../features/vrmViewer/viewerContext";
import { useAtom, useAtomValue } from "jotai";
import { firstGreetingDoneAtom, userInfoAtom, textToSpeechApiTypeAtom, isTranslatedAtom } from "@/utils/atoms";
import { speakFirstConversation } from "../features/speakFirstConversation";
import { ChatMode } from "../utils/types";

export const useUiContainerLogic = () => {
  const [chatMode, setChatMode] = useState<ChatMode>("mic");
  const [isMicRecording, setIsMicRecording] = useState<boolean>(false);
  const [userMessage, setUserMessage] = useState<string>("");
  const isTranslated = useAtomValue(isTranslatedAtom);
  const speechRecognition = useRef<SpeechRecognition | null>();
  const { handleSendChat } = useEnglishChat();
  const [firstGreetingDone, setFirstGreetingDone] = useAtom(
    firstGreetingDoneAtom
  );
  const { viewer } = useContext(ViewerContext);
  const userInfo = useAtomValue(userInfoAtom);
  const textToSpeechApiType = useAtomValue(textToSpeechApiTypeAtom);

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
    }
    recognition.addEventListener("start", startHandle);

    const errorHandle = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === "no-speech") {
        console.log("no-speech");
        return;
      }
      console.error("error", event);
    }
    recognition.addEventListener("error", errorHandle);

    const resultHandle = (event: SpeechRecognitionEvent) => {
      console.log("result", event);
      const lastIndexOfResultList = event.results.length - 1;
      const text = event.results[lastIndexOfResultList][0].transcript;

      setUserMessage(text);
    }
    recognition.addEventListener("result", resultHandle);

    const endHandle =  (event: Event) => {
      console.log("end", event);
      setIsMicRecording(false);
    }
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

  // mic recordingがfalseになったら、メッセージを送信する
  useEffect(() => {
    if (chatMode === "mic" && !isMicRecording && userMessage) {
      console.log("send message", userMessage);
      handleSendChat(userMessage);
      setUserMessage("");
    }
  }, [isMicRecording, userMessage, handleSendChat, chatMode]);

  const handleSendText = useCallback(() => {
    if (userMessage) {
      handleSendChat(userMessage);
      setUserMessage("");
    }
  }, [userMessage, handleSendChat]);

  const handleStartRecording = useCallback(() => {
    speechRecognition.current?.start();
  }, [speechRecognition]);

  const handleStopRecording = useCallback(async () => {
    speechRecognition.current?.stop();
  }, [speechRecognition]);

  const firstGreeting = useCallback(() => {
    const greet = async () => {
      if (!viewer.model || firstGreetingDone) {
        return;
      }
  
      try {
        speakFirstConversation({
          viewerModel: viewer.model,
          userName: userInfo?.name || "",
          textToSpeechApiType,
        });
        setFirstGreetingDone(true);
      } catch (error) {
        console.error(error);
      }
    };

    greet();
  }, [viewer.model, firstGreetingDone, userInfo?.name, textToSpeechApiType, setFirstGreetingDone]);

  return {
    chatMode,
    setChatMode,
    isMicRecording,
    userMessage,
    handleSendText,
    handleStartRecording,
    handleStopRecording,
    setUserMessage,
    firstGreeting,
    firstGreetingDone,
  };
};
