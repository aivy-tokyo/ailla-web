import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useResponsive } from "@/hooks/useResponsive";
import UiForSp from "./UiForSp";
import { useAtom } from "jotai";
import EndTalkButton from "./EndTalkButton";
import TranslateToggleSwitch from "./TranslateToggleSwitch";
import UiForDesktop from "./UiForDesktop";


type SelectedLanguageType = 'English' | '中文';

export const UiContainer = () => {
  const [showHint, setShowHint] = useState<boolean>(false);
  const {isDeskTop } = useResponsive();
  const [selectedLanguage, setSelectedLanguage] = useState<SelectedLanguageType>('English');
  //MEMO: ハイドレーションエラーを回避するための状態管理
  const [isClient, setIsClient] = useState<boolean>(false);
  const [isMicRecording, setIsMicRecording] = useState<boolean>(false);
  const [userMessage, setUserMessage] = useState<string>('');
  const [speechRecognition, setSpeechRecognition] = useState<SpeechRecognition>();
  const [chatProcessing, setChatProcessing] = useState<boolean>(false);

  //MEMO: ハイドレーションエラーを回避するための状態管理
  useEffect(()=>{
    setIsClient(true);
  },[]);

  const handleShowHint = () => {
    setShowHint(prev => !prev);
  };

  const handleSelectLanguage = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(e.target.value as SelectedLanguageType);
  };

  // 音声認識の結果を処理する
  const handleRecognitionResult = useCallback(
    (event: SpeechRecognitionEvent) => {
      const text = event.results[0][0].transcript;
      setUserMessage(text);

      // 発言の終了時
      if (event.results[0].isFinal) {
        setUserMessage(text);
        // 返答文の生成を開始
        // handleSendChat(text);
        console.log(text);
      }
    },
    []
  );

  // 無音が続いた場合も終了する
  const handleRecognitionEnd = useCallback(() => {
    setIsMicRecording(false);
    console.log('録音終了！');
  }, []);

  useEffect(() => {
    const SpeechRecognition =
      window.webkitSpeechRecognition || window.SpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.lang = "ja-JP";
    recognition.interimResults = true; // 認識の途中結果を返す
    recognition.continuous = false; // 発言の終了時に認識を終了する

    recognition.addEventListener("result", handleRecognitionResult);
    recognition.addEventListener("end", handleRecognitionEnd);

    setSpeechRecognition(recognition);
  }, [handleRecognitionResult, handleRecognitionEnd]);

  const handleClickMicButton = useCallback(() => {
    // if(chatProcessing)return;
    if (isMicRecording) {
      speechRecognition?.abort();
      setIsMicRecording(false);

      return;
    }

    speechRecognition?.start();
    setIsMicRecording(true);
  }, [isMicRecording, speechRecognition,chatProcessing]);

  const handleChangeUserMessage = (e: ChangeEvent<HTMLInputElement>) => {
    setUserMessage(e.target.value);
    console.log(e.target.value);
  };

  
  if(!isClient)return<></>; //MEMO: ハイドレーションエラーを回避するための状態管理
  return (
    <>
      {isDeskTop ? 
        <UiForDesktop 
          showHint={showHint} 
          handleSelectLanguage={handleSelectLanguage} 
          handleShowHint={handleShowHint} 
          handleClickMicButton={handleClickMicButton} 
          userMessage={userMessage}
          handleChangeUserMessage={handleChangeUserMessage}
        />
        : 
        <UiForSp/>
      }
    </>
  ); 
}