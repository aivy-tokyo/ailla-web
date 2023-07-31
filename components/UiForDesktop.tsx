import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import EndTalkButton from "./EndTalkButton";
import TranslateToggleSwitch from "./TranslateToggleSwitch";
import Profile from "./Profile";
import { SelectedLanguageType } from "@/utils/types";
import { FaComments, FaMicrophone, FaRegPaperPlane, FaRegSun, FaSignOutAlt, FaUserAlt } from "react-icons/fa";

interface Props {
  showHint: boolean;
  handleShowHint: () => void;
  handleSelectLanguage: (e: ChangeEvent<HTMLSelectElement>) => void;
  handleClickMicButton: () => void;
  userMessage: string;
  handleChangeUserMessage: (e: ChangeEvent<HTMLInputElement>) => void;
  selectedLanguage: SelectedLanguageType;
}

const UiForDesktop = ({
  showHint, 
  handleShowHint, 
  handleSelectLanguage, 
  handleClickMicButton, 
  userMessage, 
  handleChangeUserMessage,
  selectedLanguage,
}: Props)=>{
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
        <div className="relative -right-16 top-4 flex flex-col items-center">
          <FaUserAlt className="text-white  text-[35px]"/>
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
            <div className="flex h-6 mb-3" onClick={() => setShowProfile(false)}>
              <img src="arrowDoubleLeft.png" alt="" />
              <p className="font-bold  cursor-pointer mb-3">プロフィール確認</p>
            </div>
            <Profile/>
          </div>
           :
           <>
            {/* プロフィールボタン */}
            <div className=' bg-stone-200 w-12 h-12 rounded-md flex justify-center items-center mb-3 cursor-pointer z-20' onClick={() => setShowProfile(true)}>
              {/* <img src="settingBlack.png" alt="" className="w-[80%]"/> */}
              <FaRegSun className="text-black text-[35px]"/>
            </div>
            {/* ログアウトボタン */}
            <div className=' bg-stone-200 w-12 h-12 rounded-md flex justify-center items-center'>
              {/* <img src="logout.png" alt="" className="w-[80%]"/> */}
              <FaSignOutAlt className="text-black text-[34px]"/>
            </div>
          </>
        }
      </div>

      <div className="relative">
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
            <select className="max-w-xs bg-gray-400 h-full w-32 rounded-md px-2" value={selectedLanguage} onChange={handleSelectLanguage}>
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
                  <FaRegPaperPlane className="text-black ml-2 text-[20px]"/>
                </div>
                <img src="arrowDouble.png" alt="" className="h-[50%] mr-3 cursor-pointer" onClick={() => setShowChat(false)}/>
              </div>
          </div>
        )
        :
        <div className="h-[80px] w-[80px] bg-stone-200 fixed bottom-1 right-1 rounded-full flex justify-center items-center border-2 border-black cursor-pointer z-10" onClick={() => setShowChat(true)}>
          {/* <img src="chat.png" alt="" className="h-[50%]"/> */}
          <FaComments className="text-[35px] text-black"/>
        </div>
      }
      {/* マイクボタン */}
      <div className="fixed bottom-1 w-screen flex justify-center">
        <div className="w-20 h-20 bg-red-300 rounded-full border-4 border-red-600 flex justify-center items-center cursor-pointer" onClick={() => handleClickMicButton()}>
          {/* <img src="mic.png" alt="" className="w-[80%]"/> */}
          <FaMicrophone className="text-white text-[40px]"/>
        </div>
      </div>
    </>
  );
};

export default UiForDesktop;