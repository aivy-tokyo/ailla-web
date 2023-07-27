import { ChangeEvent, useState } from "react";
import EndTalkButton from "./EndTalkButton";
import TranslateToggleSwitch from "./TranslateToggleSwitch";
import { div } from "three/examples/jsm/nodes/Nodes.js";

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

interface Props {
  showHint: boolean;
  handleShowHint: () => void;
  handleSelectLanguage: (e: ChangeEvent<HTMLSelectElement>) => void;
  handleClickMicButton: () => void;
  userMessage: string;
  handleChangeUserMessage: (e: ChangeEvent<HTMLInputElement>) => void;
  isMicRecording: boolean;
}

const UiForSp = ({
  showHint, 
  handleShowHint, 
  handleSelectLanguage, 
  handleClickMicButton, 
  userMessage, 
  handleChangeUserMessage,
  isMicRecording,
}: Props) => {
  const [showSetting, setShowSetting] = useState<boolean>(false);

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

  return(
    <div className="">
      {/* SP版:上部のUI群 */}
      <div className="flex h-12 justify-between m-2 pt-2">
        <TranslateToggleSwitch/>
        <div className="flex">
          <EndTalkButton/>
          <img src="/setting.png" alt="" className="w-auto"/>
        </div>
      </div>

      {
        // ヒント表示領域
        showHint && 
          <div className="hint-container opacity-80 w-screen h-screen -z-0 top-12 flex items-center fixed">{/* ヒント領域のコンテナ。画面いっぱいに広げて、中のヒント領域をflex/items-centerで画面の中央に配置(他のUIをさわれなくならないよう微調整済み) */}
            <div className="w-[95%] h-[180px] bg-black opacity-75 text-white rounded-3xl m-auto relative -top-12 px-5 py-3 overflow-y-scroll">
              これはヒントです。これはヒントです。これはヒントです。これはヒントです。
              これはヒントです。これはヒントです。これはヒントです。これはヒントです。
              これはヒントです。これはヒントです。これはヒントです。これはヒントです。
              これはヒントです。
              これはヒントです。これはヒントです。これはヒントです。これはヒントです。
              これはヒントです。これはヒントです。これはヒントです。これはヒントです。
              これはヒントです。これはヒントです。これはヒントです。これはヒントです。
              これはヒントです。
            </div>
          </div>
      }

      {/* 下部のUI群 */}
      <div className="fixed bottom-0 flex flex-col  justify-between w-full  ">
        <div className="z-10 px-2 h-44 overflow-scroll">
          {speechTextArea()}
        </div>
        <div className="flex w-full h-16 bg-black  justify-between py-3 m-auto shadow-[0_-10px_50px_30px_rgba(0,0,0,1)]">
          <div className="flex">
            <img src={isMicRecording ? 'micRed.png' : 'mic.png'} alt="" className="" onClick={handleClickMicButton}/>
            <input type="text" className=" px-4 bg-black text-white border border-white rounded-full" placeholder="コメントする" value={userMessage} onChange={handleChangeUserMessage}/>
            <img src="/send.png" alt="" className='h-[70%] ml-2 self-center'/>
          </div>
          <img src="/hint.png" alt="" className="h-[90%] self-center pr-2" onClick={handleShowHint}/>
        </div>
      </div>
    </div>
  );
};

export default UiForSp;