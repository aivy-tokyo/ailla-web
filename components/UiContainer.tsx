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


  

  
  if(!isClient)return<></>; //MEMO: ハイドレーションエラーを回避するための状態管理
  return (
    <>
      {isDeskTop ? 
        <UiForDesktop showHint={showHint} handleSelectLanguage={handleSelectLanguage} handleShowHint={handleShowHint}/>
        : 
        <UiForSp/>
      }
    </>
  ); 
}