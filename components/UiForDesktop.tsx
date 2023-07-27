import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import EndTalkButton from "./EndTalkButton";
import TranslateToggleSwitch from "./TranslateToggleSwitch";
import { div } from "three/examples/jsm/nodes/Nodes.js";

interface Props {
  showHint: boolean;
  handleShowHint: () => void;
  handleSelectLanguage: (e: ChangeEvent<HTMLSelectElement>) => void;
  handleClickMicButton: () => void;
  userMessage: string;
  handleChangeUserMessage: (e: ChangeEvent<HTMLInputElement>) => void;
}

const UiForDesktop = ({showHint, handleShowHint, handleSelectLanguage, handleClickMicButton, userMessage, handleChangeUserMessage}: Props)=>{
  const [showProfile, setShowProfile] = useState<boolean>(false);
  const [showChat, setShowChat] = useState<boolean>(false);

  const speechBubbleForAilla = (text: string) => {
    return  (
      <div className='bg-[#36d854] w-[70%] h-20 rounded-3xl relative left-8 px-4 py-1 mb-2 opacity-100'>
        <div className="speech-bubble-triangle-for-ailla absolute top-3 -left-10 -z-20"></div>
        <p>{text}</p>
      </div>
    );
  }

  const speechBubbleForUser = (text: string) => {
    return (
      <div className="flex">
        <div className='bg-white w-[70%] h-20 rounded-3xl relative left-8 px-4 py-1 mb-2'>
          <div className="speech-bubble-triangle-for-user absolute top-3 -right-10 "></div>
          <p>{text}</p>
        </div>
        <div className="relative -right-14 flex flex-col items-center">
          <img src="myIcon.png" alt="" className="h-14 relative"/>
          <p>Taro</p>
        </div>
      </div>
    );
  };
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

      <div className="relative bg-red-500">
        {/* 上部右側のUI群 */}
        <div className="flex bg-emerald-300 fixed w-[500px] h-10 top-0 right-0 text-black justify-between">
          <div className="flex cursor-pointer items-center pl-3" onClick={handleShowHint}>
            {
              showHint ? <img src="arrow.png" alt="" className="h-5"/> : <img src="downArrow.png" alt="" className="h-5"/> 
            }
            <p className="self-center">ヒント</p>
          </div>
          <div className="flex h-[80%] self-center pr-3">
            <EndTalkButton/>
            {/* 言語選択 */}
            <select className="max-w-xs bg-gray-400 h-full w-32 rounded-md px-2" onChange={handleSelectLanguage}>
              {/* <option disabled selected>Pick your favorite Simpson</option> */}
              <option>English</option>
              <option>中文</option>
            </select>
            <div className="text-white flex items-center ml-3">
              <span className='text-xs text-black font-bold'>翻訳</span>
              <TranslateToggleSwitch/>
            </div>
          </div>
        </div>
        {
          showHint && (
            <div className="w-[500px] h-[200px] absolute right-0 top-10 bg-white text-black">
              <p>
                伝え方がわからない場合は、以下のフレーズを参考にしてみてください。
              </p>
              <p>
                1. May I have your name?<br/>
                2. Where are you from?<br/>
                3. What is your job?<br/>
              </p>
            </div>
          )
        }
      </div>

      {/* 右下のチャットログ領域 */}
      {
        showChat ? 
        (
          <div className="w-[500px] h-[500px] bg-stone-200 opacity-90 absolute bottom-[5px] right-[5px] rounded-3xl pt-5 text-black z-10">
            <div className="overflow-y-scroll h-[88%]">
              {speechBubbleForAilla('Hello!! Hello!! Hello!! Hello!! Hello!! Hello!! ')}
              {speechBubbleForUser('Hello, AILLA! Hello, AILLA! Hello, AILLA! Hello, AILLA! Hello, AILLA! Hello, AILLA! ')}
              {speechBubbleForAilla('This is sample text. This is sample text.This is sample text.This is sample text.This is sample text.')}
              {speechBubbleForUser('Hello, AILLA! Hello, AILLA! Hello, AILLA! Hello, AILLA! Hello, AILLA! Hello, AILLA! ')}
              {speechBubbleForAilla('This is sample text. This is sample text.This is sample text.This is sample text.This is sample text.')}
              {speechBubbleForUser('Hello, AILLA! Hello, AILLA! Hello, AILLA! Hello, AILLA! Hello, AILLA! Hello, AILLA! ')}
              {speechBubbleForAilla('This is sample text. This is sample text.This is sample text.This is sample text.This is sample text.')}
              {speechBubbleForUser('Hello, AILLA! Hello, AILLA! Hello, AILLA! Hello, AILLA! Hello, AILLA! Hello, AILLA! ')}
            </div>
              <div className="absolute bottom-3 flex h-10 w-full items-center justify-between">
                <div className="flex h-full items-center w-[90%] ">
                  <input type="text" placeholder="コメントする" className=" border border-black border-solid h-full rounded-full ml-8 w-[70%] px-5 bg-white" value={userMessage} onChange={handleChangeUserMessage}/>
                  <img src="sendBlack.png" alt="" className="h-[50%] ml-2"/>
                </div>
                <img src="arrowDouble.png" alt="" className="h-[50%] mr-3 cursor-pointer" onClick={() => setShowChat(false)}/>
              </div>
          </div>
        )
        :
        <div className="h-[80px] w-[80px] bg-stone-200 fixed bottom-1 right-1 rounded-full flex justify-center items-center border-2 border-black cursor-pointer z-10" onClick={() => setShowChat(true)}>
          <img src="chat.png" alt="" className="h-[50%]"/>
        </div>
      }
      {/* マイクボタン */}
      <div className="fixed bottom-1 w-screen flex justify-center">
        <div className="w-20 h-20 bg-red-300 rounded-full border-4 border-red-600 flex justify-center items-center cursor-pointer" onClick={() => handleClickMicButton()}>
          <img src="mic.png" alt="" className="w-[80%]"/>
        </div>
      </div>
    </>
  );
};

export default UiForDesktop;