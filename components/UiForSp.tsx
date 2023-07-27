import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import EndTalkButton from "./EndTalkButton";
import TranslateToggleSwitch from "./TranslateToggleSwitch";
import { SelectedLanguageType } from "@/utils/types";
import Profile from "./Profile";

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
  // handleSelectLanguage: (e: ChangeEvent<HTMLSelectElement>) => void;
  handleClickMicButton: () => void;
  userMessage: string;
  handleChangeUserMessage: (e: ChangeEvent<HTMLInputElement>) => void;
  isMicRecording: boolean;
  selectedLanguage: SelectedLanguageType;
  setSelectedLanguage: Dispatch<SetStateAction<SelectedLanguageType>>
}

const UiForSp = ({
  showHint, 
  handleShowHint, 
  // handleSelectLanguage, 
  handleClickMicButton, 
  userMessage, 
  handleChangeUserMessage,
  isMicRecording,
  selectedLanguage,
  setSelectedLanguage,
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

  const handleClickSettingButton = () => {
    console.log(showSetting);
    setShowSetting(prev => !prev);
  };

  console.log(selectedLanguage);
  return(
    <div className="">
      {/* SP版:上部のUI群 */}
      <div className="flex h-12 justify-between m-2 pt-2">
        <TranslateToggleSwitch/>
        <div className="flex z-10">
          <EndTalkButton/>
          <img src="/setting.png" alt="" className="w-auto cursor-pointer" onClick={() => handleClickSettingButton()}/>
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

      {
        //セッティングモーダル
        showSetting && 
          <div className="w-screen h-screen opacity-90 bg-black z-30 top-0 fixed">
            <div className="flex justify-end py-4 pr-2">
              <img src="close.png" alt="" className="w-10 h-10" onClick={() => handleClickSettingButton()}/>
            </div>
            <div className="setting-container px-10">
              <div className="mb-10">
                <h2 className="mb-3">Language</h2>
                <div className="flex items-center">
                  <button className={`${selectedLanguage === 'English' ? 'bg-blue-400' : 'bg-stone-400'}  w-[120px] px-5 py-1 mr-5 text-center rounded-md`} onClick={() => setSelectedLanguage('English')}>English</button>
                  <button className={`${selectedLanguage === '中文' ? 'bg-blue-400' : 'bg-stone-400'}  w-[120px] px-5 py-1 text-center rounded-md`} onClick={() => setSelectedLanguage('中文')}>中文</button>
                </div>
              </div>

              <div>
                <h2 className="mb-3">Profile</h2>
                <Profile/>
              </div>
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