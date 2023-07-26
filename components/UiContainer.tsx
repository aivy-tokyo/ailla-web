import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useResponsive } from "@/hooks/useResponsive";

const dummyUsersData = [
  {
    iconSrc: 'myIcon.png',
    userName: 'Taro',
    text: 'This is sample text. This is sample text.This is sample text.This is sample text.This is sample text.',
  },
  {
    iconSrc: 'myIcon.png',
    userName: 'Taro2',
    text: 'Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! ',
  },
  {
    iconSrc: 'myIcon.png',
    userName: 'Taro',
    text: 'This is sample text. This is sample text.This is sample text.This is sample text.This is sample text.',
  },
  {
    iconSrc: 'myIcon.png',
    userName: 'Taro2',
    text: 'Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! ',
  },
]

type SelectedLanguageType = 'English' | '中文';

export const UiContainer = () => {
  const [isTranslated, setIsTranslated] = useState<boolean>(false);
  const [showSetting, setShowSetting] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const {isDeskTop } = useResponsive();
  const [selectedLanguage, setSelectedLanguage] = useState<SelectedLanguageType>('English');
  //MEMO: ハイドレーションエラーを回避するための状態管理
  const [isClient, setIsClient] = useState<boolean>(false);
  const [showProfile, setShowProfile] = useState<boolean>(false);

  //MEMO: ハイドレーションエラーを回避するための状態管理
  useEffect(()=>{
    setIsClient(true);
  },[]);

  const handleTranslate = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.checked);
    if(e.target.checked){
      setIsTranslated(true);
    }else{
      setIsTranslated(false);
    }
  };

  const speechTextArea = () => {
    return  dummyUsersData.map((userData,id) => (
      <div className="flex" key={id}>
        <img src={userData.iconSrc} alt="" className="h-14"/>
        <div>
          <p className="text-xl font-bold">{userData.userName}</p>
          <p>{userData.text}</p>
        </div>
      </div>
    ));        
  };

  //シチュエーション会話終了ボタン
  const endTalkButton = () => {
    return (
      <button className="bg-red-400 w-28 text-black font-bold rounded-md flex justify-center items-center mr-2">
        <span>終了</span>
      </button>
    );
  };

  // 翻訳ON/OFFトグルスイッチ 
  const translateToggleSwitch = () => {
    return (
      <label className="cursor-pointer flex items-center relative">
      {isTranslated ?
        <span className="absolute left-2 text-xs">OFF</span>
        :
        <span className="absolute right-2 text-xs">ON</span> 
      }
      <input type="checkbox" className="toggle toggle-lg toggle-info" checked={isTranslated} onChange={(e) => handleTranslate(e)}/>
    </label>
    );
  };

  const handleShowHint = () => {
    setShowHint(prev => !prev);
  };

  const handleSelectLanguage = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(e.target.value as SelectedLanguageType);
  };


  const uiForSP = () => {
      return(
        <div className="">
          {/* SP版:上部のUI群 */}
          <div className="flex h-12 justify-between m-2 pt-2">
            {translateToggleSwitch()}
            <div className="flex">
              {endTalkButton()}
              <img src="/setting.png" alt="" className="w-auto"/>
            </div>
          </div>
    
          {/* 下部のUI群 */}
          <div className="fixed bottom-0 flex flex-col  justify-between w-full  ">
            <div className="z-10 px-2 h-44 overflow-scroll">
              {speechTextArea()}
            </div>
            <div className="flex w-full h-16 bg-black  justify-between py-3 m-auto shadow-[0_-10px_50px_30px_rgba(0,0,0,1)]">
            {/* <div className="flex w-full h-16 bg-black  justify-between py-3 m-auto "> */}
              <div className="flex">
                <img src="/mic.png" alt="" className=""/>
                <input type="text" className=" px-4 bg-black text-white border border-white rounded-full" placeholder="コメントする"/>
                <img src="/send.png" alt="" className='h-[70%] ml-2 self-center'/>
              </div>
              <img src="/hint.png" alt="" className="h-[90%] self-center pr-2"/>
            </div>
          </div>
        </div>
      );
    };

  const uiForDesktop = ()=>{
    return (
      <>
          {/* 上部左側のプロフィールボタンとログアウトボタン */}
          <div className="pt-2 pl-3 fixed ">
            {
              showProfile ?
              <div className="fixed text-black bg-stone-300 w-[240px]  rounded-2xl p-5 pt-3 z-20 cursor-pointer">
                <p className="font-bold  cursor-pointer mb-3" onClick={() => setShowProfile(false)}>プロフィール確認</p>
                <div className="flex mb-3">
                  <img src="myIcon.png" alt="" className="h-14 -ml-1"/>
                  <div>
                    <p>Taro</p>
                    <p>サンプル株式会社</p>
                  </div>
                </div>
                <p>sample@sample.com</p>
                <p>090-0000-9999</p>
                <p>東京都港区愛宕2-5-1</p>
                <p>1991年1月1日</p>
                <p>男性</p>
              </div>
               :
               <>
                {/* プロフィールボタン */}
                <div className=' bg-stone-200 w-12 h-12 rounded-md flex justify-center items-center mb-3 cursor-pointer z-20' onClick={() => setShowProfile(true)}>
                  <img src="settingBlack.png" alt="" className="w-[80%]"/>
                </div>
                {/* ログアウトボタン */}
                <div className=' bg-stone-200 w-12 h-12 rounded-md flex justify-center items-center'>
                  <img src="logout.png" alt="" className="w-[80%]"/>
                </div>
              </>
            }
          </div>

        {/* 上部右側のUI群 */}
        <div className="flex bg-emerald-300 fixed w-[500px] h-10 top-0 right-0 text-black justify-between">
          <div className="flex cursor-pointer items-center pl-3" onClick={() => handleShowHint()}>
            {
              showHint ? <img src="arrow.png" alt="" className="h-5"/> : <img src="downArrow.png" alt="" className="h-5"/> 
            }
            <p className="self-center">ヒント</p>
          </div>
          <div className="flex h-[80%] self-center pr-3">
            {endTalkButton()}
            {/* 言語選択 */}
            <select className="max-w-xs bg-gray-400 h-full w-32 rounded-md px-2" onChange={(e) => handleSelectLanguage(e)}>
              {/* <option disabled selected>Pick your favorite Simpson</option> */}
              <option>English</option>
              <option>中文</option>
            </select>
            <div className="text-white flex items-center ml-3">
              <span className='text-xs text-black font-bold'>翻訳</span>
              {translateToggleSwitch()}
            </div>
          </div>
        </div>
      </>
    );
  };

  
  if(!isClient)return<></>; //MEMO: ハイドレーションエラーを回避するための状態管理
  return (
    <>
      {isDeskTop ? 
        uiForDesktop() 
        : 
        uiForSP()
      }
    </>
  ); 
}