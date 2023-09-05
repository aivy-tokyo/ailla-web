import { useRef, useEffect, useState, useCallback, use } from "react";
import { ChatMode } from "../utils/types";
import { isCharactorSpeakingAtom, isTranslatedAtom } from "../utils/atoms";
import { useAtomValue } from "jotai";

type Props = {
  onStartRecording: () => void;
  onStopRecording: (message: string) => void;
}
export const useUserInput = ({
  onStartRecording,
  onStopRecording,
}: Props) => {
  const isTranslated = useAtomValue(isTranslatedAtom);
  const isCharactorSpeaking = useAtomValue(isCharactorSpeakingAtom);
  
  const transcriptRef = useRef("");
  const speechRecognition = useRef<SpeechRecognition | null>();
  const [chatMode, setChatMode] = useState<ChatMode>("mic");
  const [isMicRecording, setIsMicRecording] = useState(false);
  const [userMessage, setUserMessage] = useState<string>("");

  useEffect(() => {
    const SpeechRecognition =
      window.webkitSpeechRecognition || window.SpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.lang = isTranslated ? "ja-JP" : "en-US"; // 言語を指定する
    recognition.interimResults = false; // 途中経過を取得する
    recognition.continuous = true; // 連続的に音声認識を行う
    recognition.maxAlternatives = 1; // 1つの認識結果のみを取得する

    const startHandle = (event: Event) => {
      console.log("start", event);
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
      const lastIndexOfResultList = event.results.length - 1;
      const text = event.results[lastIndexOfResultList][0].transcript;
      console.log("result", text);
      transcriptRef.current = transcriptRef.current + text;

      setUserMessage(prev => {
        // transcriptRef.current = prev + text;
        return prev + text
      });
    };
    recognition.addEventListener("result", resultHandle);

    const endHandle = (event: Event) => {
      console.log("end", event);
      console.log(userMessage);
      console.log(transcriptRef.current);
      onStopRecording(transcriptRef.current);
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
  }, [isTranslated, onStopRecording, userMessage]);

  const handleStartRecording = useCallback(() => {
    console.log("handleStartRecording", isCharactorSpeaking);
    // キャラクターが発話中の場合は、マイクを起動しない
    if (isCharactorSpeaking) {
      return;
    }

    console.log(speechRecognition.current, transcriptRef.current);
    speechRecognition.current?.start();
    setTimeout(() => {
      speechRecognition.current?.start();
    }, 500);
    setUserMessage("");
    transcriptRef.current = "";
    setIsMicRecording(true);
    onStartRecording();
  }, [isCharactorSpeaking, onStartRecording]);

  const handleStopRecording = useCallback(() => {
    speechRecognition.current?.stop();
    setIsMicRecording(false);
    return transcriptRef.current;
  }, []);

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
