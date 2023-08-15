import { ChangeEvent, useCallback, useEffect, useState } from "react";
import UiForSp from "./UiForSp";
import { SelectedLanguageType } from "@/utils/types";
import { useEnglishChat } from "@/hooks/useEnglishChat";
import { useAtomValue } from "jotai";
import { chatLogAtom } from "@/utils/atoms";


export const UiContainer = () => {
  const [showHint, setShowHint] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<SelectedLanguageType>('English');
  //MEMO: ハイドレーションエラーを回避するための状態管理
  const [isClient, setIsClient] = useState<boolean>(false);
  const [isMicRecording, setIsMicRecording] = useState<boolean>(false);
  const [userMessage, setUserMessage] = useState<string>('');
  const [speechRecognition, setSpeechRecognition] = useState<SpeechRecognition>();
  const [chatProcessing, setChatProcessing] = useState<boolean>(false);
  const {handleSendChat} = useEnglishChat()
  const chatLog = useAtomValue(chatLogAtom);

  //MEMO: ハイドレーションエラーを回避するための状態管理
  useEffect(()=>{
    setIsClient(true);
  },[]);

  const handleShowHint = () => {
    setShowHint(prev => !prev);
  };

  // 音声認識の結果を処理する
  const handleRecognitionResult = useCallback(
    (event: SpeechRecognitionEvent) => {
      console.log('handleRecognitionResultのevent->',event);
      const lastIndexOfResultList = event.results.length - 1;
      const text = event.results[lastIndexOfResultList][0].transcript;
      
      setUserMessage(prev => prev + text);

      // 無音になるとisFinalがtrueになるのでその時の処理(無音になっても録音継続)
      if (event.results[0].isFinal && isMicRecording) {
        speechRecognition?.start();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isMicRecording]//Warning: 依存配列にspeechRecognitionを加えてはならない。useEffectが無限に実行される
  );

  useEffect(() => {
    console.log('useEffect新規実行！')
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
    if (isMicRecording) {
      speechRecognition?.abort();
      setIsMicRecording(false);

      return;
    }

    speechRecognition?.start();
    setIsMicRecording(true);
  }, [isMicRecording, speechRecognition]);

  const handleStopRecording = useCallback(async() => {
    speechRecognition?.removeEventListener('result', handleRecognitionResult);
    speechRecognition?.stop();
    setSpeechRecognition(undefined);
    setIsMicRecording(false);

    // 少し待つ
    await new Promise(resolve => setTimeout(resolve, 500));

    // 返答文の生成を開始
    handleSendChat(userMessage);
    setUserMessage('');
  }, [speechRecognition, handleRecognitionResult, handleSendChat, userMessage]);

  const handleChangeUserMessage = (e: ChangeEvent<HTMLInputElement>) => {
    setUserMessage(e.target.value);
  };

  
  if(!isClient)return<></>; //MEMO: ハイドレーションエラーを回避するための状態管理
  return (
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
  
  ); 
}