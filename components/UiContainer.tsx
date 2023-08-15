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
      const text = event.results[0][0].transcript;
      setUserMessage(text);

      // 発言の終了時
      if (event.results[0].isFinal) {
        // 返答文の生成を開始
        handleSendChat(text);
        
        setUserMessage('');
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [chatLog, handleSendChat]//MEMO:依存配列にchatLogを指定しないと発話のたびにchatLogがリセットされてしまう。
  );

  // 無音が続いた場合も終了する
  const handleRecognitionEnd = useCallback(() => {
    setIsMicRecording(false);
  }, []);

  useEffect(() => {
    const SpeechRecognition =
      window.webkitSpeechRecognition || window.SpeechRecognition;

    const recognition = new SpeechRecognition();
    // recognition.lang = "en-US";
    recognition.lang = "JP";
    recognition.interimResults = true; // 認識の途中結果を返す
    recognition.continuous = false; // 発言の終了時に認識を終了する

    recognition.addEventListener("result", handleRecognitionResult);
    recognition.addEventListener("end", handleRecognitionEnd);

    setSpeechRecognition(recognition);
  }, [handleRecognitionResult, handleRecognitionEnd]);

  const handleStartRecording = useCallback(() => {
    // if(chatProcessing)return;
    if (isMicRecording) {
      speechRecognition?.abort();
      setIsMicRecording(false);

      return;
    }

    speechRecognition?.start();
    setIsMicRecording(true);
  // }, [isMicRecording, speechRecognition,chatProcessing]);
  }, [isMicRecording, speechRecognition]);

  const handleChangeUserMessage = (e: ChangeEvent<HTMLInputElement>) => {
    setUserMessage(e.target.value);
  };

  
  if(!isClient)return<></>; //MEMO: ハイドレーションエラーを回避するための状態管理
  return (
    <UiForSp
      showHint={showHint} 
      handleShowHint={handleShowHint} 
      handleStartRecording={handleStartRecording} 
      userMessage={userMessage}
      setUserMessage={setUserMessage}
      handleChangeUserMessage={handleChangeUserMessage}
      isMicRecording={isMicRecording}
      selectedLanguage={selectedLanguage}
      setSelectedLanguage={setSelectedLanguage}
    />
  
  ); 
}