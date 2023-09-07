import { useAtomValue, useSetAtom } from "jotai";
import { useState, useRef, useEffect, useCallback } from "react";
import { isTranslatedAtom, isCharactorSpeakingAtom, isVoiceInputAllowedAtom } from "../utils/atoms";
import * as Sentry from "@sentry/nextjs";

type Props = {
  onStartRecording?: () => void;
  onStopRecording?: (message: string) => void;
};

type ReturnType = {
  startRecording: () => void;
  stopRecording: () => void;
  isMicRecording: boolean;
  getUserMediaPermission: () => void;
};

let recognition: SpeechRecognition;
if (typeof window !== "undefined") {
  const SpeechRecognition =
    window.webkitSpeechRecognition || window.SpeechRecognition;
  recognition = new SpeechRecognition();
}

export const useVoiceInput = ({
  onStartRecording,
  onStopRecording,
}: Props): ReturnType => {
  const isTranslated = useAtomValue(isTranslatedAtom);
  const isCharactorSpeaking = useAtomValue(isCharactorSpeakingAtom);
  const setIsVoiceInputAllowed = useSetAtom(isVoiceInputAllowedAtom);

  const [isMicRecording, setIsMicRecording] = useState(false);
  const transcriptsRef = useRef<string[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState<string>("");

  useEffect(() => {
    recognition.lang = isTranslated ? "ja-JP" : "en-US"; // 言語を指定する
    recognition.interimResults = true; // 途中経過を取得する
    recognition.continuous = true; // 連続的に音声認識を行う
    recognition.maxAlternatives = 1; // 1つの認識結果のみを取得する

    const startHandle = (event: Event) => {
      console.log("start", event);
      if (onStartRecording) {
        onStartRecording();
      }
      setIsMicRecording(true);
      transcriptsRef.current = [];
    };
    recognition.addEventListener("start", startHandle);

    const errorHandle = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === "no-speech") {
        console.log("no-speech");
        return;
      }
      Sentry.captureException(event.error);
    };
    recognition.addEventListener("error", errorHandle);

    const endHandle = (event: Event) => {
      console.log("end", event, transcriptsRef.current);
      if (onStopRecording) {
        onStopRecording(transcriptsRef.current.join(" "));
      }
      setIsMicRecording(false);
      transcriptsRef.current = [];
    };
    recognition.addEventListener("end", endHandle);

    const resultHandle = (event: SpeechRecognitionEvent) => {
      const { results } = event;
      const result = results[results.length - 1];
      const transcript = result[0].transcript;

      if (result.isFinal) {
        transcriptsRef.current.push(transcript);
        setCurrentTranscript(transcript);
      } else {
        setCurrentTranscript(transcript);
      }
      console.log("result", result.isFinal, transcript);
      console.log("transcriptsRef.current", transcriptsRef.current);
    };
    recognition.addEventListener("result", resultHandle);

    console.log("recognition", recognition);

    return () => {
      recognition.removeEventListener("start", startHandle);
      recognition.removeEventListener("error", errorHandle);
      recognition.removeEventListener("end", endHandle);
      recognition.removeEventListener("result", resultHandle);
    };
  }, [isTranslated, onStartRecording, onStopRecording]);

  const getUserMediaPermission = useCallback(async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsVoiceInputAllowed(true);
    } catch (error) {
      Sentry.captureException(error);
    }
  }, [setIsVoiceInputAllowed]);

  const startRecording = useCallback(() => {
    console.log("startRecording", isCharactorSpeaking);
    // キャラクターが発話中の場合は、マイクを起動しない
    if (isCharactorSpeaking) {
      return;
    }
    recognition.start();
  }, [isCharactorSpeaking]);

  const stopRecording = useCallback(() => {
    console.log("stopRecording");
    recognition.stop();
  }, []);

  return {
    startRecording,
    stopRecording,
    isMicRecording,
    getUserMediaPermission,
  };
};
