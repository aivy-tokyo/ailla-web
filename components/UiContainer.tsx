import {
  ChangeEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import UiForSp from "./UiForSp";
import { SelectedLanguageType } from "@/utils/types";
import { useEnglishChat } from "@/hooks/useEnglishChat";
import { useAtom, useAtomValue } from "jotai";
import { chatLogAtom, firstGreetingDoneAtom } from "@/utils/atoms";
import { useFirstConversation } from "../hooks/useFirstConversation";
import { ViewerContext } from "../features/vrmViewer/viewerContext";

export const UiContainer = () => {
  const [showHint, setShowHint] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] =
    useState<SelectedLanguageType>("English");
  //MEMO: ハイドレーションエラーを回避するための状態管理
  const [isClient, setIsClient] = useState<boolean>(false);
  const [isMicRecording, setIsMicRecording] = useState<boolean>(false);
  const [userMessage, setUserMessage] = useState<string>("");
  const [speechRecognition, setSpeechRecognition] =
    useState<SpeechRecognition>();
  const [chatProcessing, setChatProcessing] = useState<boolean>(false);
  const { handleSendChat } = useEnglishChat();
  const chatLog = useAtomValue(chatLogAtom);

  //MEMO: ハイドレーションエラーを回避するための状態管理
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleShowHint = () => {
    setShowHint((prev) => !prev);
  };

  // 音声認識の結果を処理する
  const handleRecognitionResult = useCallback(
    (event: SpeechRecognitionEvent) => {
      const lastIndexOfResultList = event.results.length - 1;
      const text = event.results[lastIndexOfResultList][0].transcript;

      setUserMessage((prev) => prev + text);

      // 無音になるとisFinalがtrueになるのでその時の処理(無音になっても録音継続)
      if (event.results[0].isFinal && isMicRecording) {
        speechRecognition?.start();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isMicRecording] //Warning: 依存配列にspeechRecognitionを加えてはならない。useEffectが無限に実行される
  );

  useEffect(() => {
    const SpeechRecognition =
      window.webkitSpeechRecognition || window.SpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false; // 認識の途中結果を返さない
    recognition.continuous = true;

    recognition.addEventListener("result", handleRecognitionResult);

    setSpeechRecognition(recognition);
  }, [handleRecognitionResult]);

  const handleStartRecording = useCallback(() => {
    console.log('start');

    speechRecognition?.start();
    setIsMicRecording(true);
  }, [speechRecognition]);

  const handleStopRecording = useCallback(async () => {
    speechRecognition?.removeEventListener("result", handleRecognitionResult);
    speechRecognition?.stop();
    setSpeechRecognition(undefined);
    setIsMicRecording(false);

    // 少し待つ
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 返答文の生成を開始
    handleSendChat(userMessage);
    setUserMessage("");
  }, [speechRecognition, handleRecognitionResult, handleSendChat, userMessage]);

  const handleChangeUserMessage = (e: ChangeEvent<HTMLInputElement>) => {
    setUserMessage(e.target.value);
  };

  // 最初の挨拶をする
  const [firstGreetingDone, setFirstGreetingDone] = useAtom(
    firstGreetingDoneAtom
  );
  const { viewer } = useContext(ViewerContext);
  const { speakFirstConversation } = useFirstConversation();
  const firstGreeting = useCallback(() => {
    if (!viewer.model || firstGreetingDone) {
      return;
    }

    const greet = async () => {
      try {
        console.log("firstGreeting");
        speakFirstConversation();
        setFirstGreetingDone(true);
      } catch (error) {
        console.error(error);
      }
    };

    greet();
  }, [
    viewer.model,
    speakFirstConversation,
    firstGreetingDone,
    setFirstGreetingDone,
  ]);

  if (!isClient) return <></>; //MEMO: ハイドレーションエラーを回避するための状態管理
  return (
    <>
      <UiForSp
        showHint={showHint}
        handleShowHint={handleShowHint}
        handleStartRecording={handleStartRecording}
        handleStopRecording={handleStopRecording}
        userMessage={userMessage}
        setUserMessage={setUserMessage}
        handleChangeUserMessage={handleChangeUserMessage}
        isMicRecording={isMicRecording}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
      />
      {!firstGreetingDone && !chatProcessing && chatLog.length === 0 && (
        <button
          className="
      z-50
      fixed
      top-1/2
      left-1/2
      transform
      -translate-x-1/2
      -translate-y-1/2
      w-20
      bg-white
      text-black
      rounded-full
      "
          onClick={() => firstGreeting()}
        >
          start
        </button>
      )}
    </>
  );
};
