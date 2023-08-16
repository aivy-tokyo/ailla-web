import { ChangeEvent, Dispatch, SetStateAction, useCallback, useState } from "react";
import EndTalkButton from "./EndTalkButton";
import TranslateToggleSwitch from "./TranslateToggleSwitch";
import { SelectedLanguageType, TextToSpeechApiType } from "@/utils/types";
import Profile from "./Profile";
import { FaMicrophone, FaQuestion, FaRegComments, FaRegPaperPlane, FaRegSun, FaRegTimesCircle, FaRegUserCircle} from 'react-icons/fa';
import { avatarPathAtom, backgroundImagePathAtom, chatLogAtom, textToSpeechApiTypeAtom } from "@/utils/atoms";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { avatars, backgroundImages, textToSpeechApiTypeList } from "@/utils/constants";
import { signOut } from "next-auth/react";
import { useEnglishChat } from "@/hooks/useEnglishChat";
import { useProfile } from "@/hooks/useProfile";


type Props = {
  showHint: boolean;
  handleShowHint: () => void;
  handleStartRecording: () => void;
  handleStopRecording: () => void;
  setUserMessage: Dispatch<SetStateAction<string>>;
  userMessage: string;
  handleChangeUserMessage: (e: ChangeEvent<HTMLInputElement>) => void;
  isMicRecording: boolean;
  selectedLanguage: SelectedLanguageType;
  setSelectedLanguage: Dispatch<SetStateAction<SelectedLanguageType>>
}

const UiForSp = ({
  showHint, 
  handleShowHint, 
  handleStartRecording, 
  handleStopRecording,
  userMessage, 
  setUserMessage,
  handleChangeUserMessage,
  isMicRecording,
  selectedLanguage,
  setSelectedLanguage,
}: Props) => {
  const [showSetting, setShowSetting] = useState<boolean>(false);
  const [chatIconSelected, setChatIconSelected] = useState<boolean>(false);
  const setAvatarPath = useSetAtom(avatarPathAtom);
  const setBackgroundImagePath = useSetAtom(backgroundImagePathAtom);
  const {handleSendChat} = useEnglishChat();
  const {userName} = useProfile();
  const chatLogs = useAtomValue(chatLogAtom);
  const setTextToSpeechApiType = useSetAtom(textToSpeechApiTypeAtom);
  const [isChatLogExpanded, setIsChatLogExpanded] = useState<boolean>(false);

  const speechTextArea = () => {
    return  chatLogs.map((chatLog,id) => (
      <div className={`chat flex text-white max-w-[900px] justify-end ${chatLog.role === 'user' ? 'chat-end' : 'chat-start '}`} key={id}>
        <div className={`m-0`}>
          <p className={`${chatLog.role === 'user' ? 'chat-bubble bg-gray-100 text-gray-600' : 'chat-bubble bg-gray-800 text-white'}`}>{chatLog.content}</p>
        </div>
      </div>
    ));        
  };

  const sendChat = () => {
    handleSendChat(userMessage);
    setUserMessage('');
  };

  const handleClickMicButton = () => {
    if(chatIconSelected){
      setChatIconSelected(false);
    }
    if(isMicRecording){
      handleStopRecording()
    }else{
      handleStartRecording();
    }
  };

  const handleClickSettingButton = () => {
    setShowSetting(prev => !prev);
  };

  const questionIcon = () => {
    return (
      <div className="h-[35px] w-[35px] rounded-full self-center bg-black border-2 border-white flex justify-center items-center cursor-pointer">
        <FaQuestion className="text-white text-[20px] " onClick={handleShowHint}/>
      </div>
    );
  };
  const micIcon = () => {
    return (
      <div 
        className={`${chatIconSelected ? 'w-[35px] h-[35px] ': 'w-[60px] h-[60px]'} rounded-full  bg-black border-2 border-white flex justify-center items-center cursor-pointer`} 
        onClick={() => handleClickMicButton()}
      >
        <FaMicrophone className={`${isMicRecording ? ' text-red-500' : 'text-white'} ${chatIconSelected ? 'text-[23px]' : 'text-[30px]'}`} />
      </div>
    );
  };
  const chatIcon = () => {
    return (
      <div className="h-[35px] w-[35px] rounded-full self-center bg-black border-2  border-white flex justify-center items-center cursor-pointer" onClick={() => setChatIconSelected(true)}>
        <FaRegComments className="text-white text-[20px] self-center"/>
      </div>
    );
  };

  const bottomUiDefault = () => {
    return (
      <div className="flex max-w-[250px] h-[60px] justify-between items-center mx-auto px-5">
        {questionIcon()}
        {micIcon()}
        {chatIcon()}
      </div>
    );
  };

  const bottomUiChatIconSelected = () => {
    return (
      <div className="flex max-w-[900px] h-[60px] items-center mx-auto justify-between px-5">
        {questionIcon()}
        <input type="text" placeholder="文字を入力する" value={userMessage} className="w-[70%] rounded-full px-4 h-10 text-white" onChange={handleChangeUserMessage}/>
        {userMessage.length > 0 ? 
          <div className="w-[35px] h-[35px] rounded-full bg-black border-2 border-white flex justify-center items-center pr-1" onClick={()=> sendChat()}>
            <FaRegPaperPlane className="text-white text-[20px] cursor-pointer"/>
          </div> 
          : 
          micIcon()
        }
      </div>
    );
  };

  const handleChangeAvatar = (e: ChangeEvent<HTMLSelectElement>) => {
    setAvatarPath(e.target.value);
  };

  const handleChangeBackgroundImage = (e: ChangeEvent<HTMLSelectElement>) => {
    setBackgroundImagePath(e.target.value);
  };

  const handleChangeVoiceApi = (e: ChangeEvent<HTMLSelectElement>) => {
    setTextToSpeechApiType(e.target.value as TextToSpeechApiType);
  };

  // useCallback: サインアウト
  const signout = useCallback(() => {
    signOut();
  } ,[]);

  const handleExpandChatLog = useCallback(()=>{
    setIsChatLogExpanded(prev => !prev);
  },[]);

  const settingContainer = () => {
    return (
      <div className="w-screen h-screen opacity-90 bg-black z-30 top-0 fixed text-white overflow-y-scroll">
        <div className="flex justify-end  fixed top-0 right-0 mt-2 cursor-pointer">
          <FaRegTimesCircle className="text-white text-[34px] " onClick={handleClickSettingButton}/>
        </div>
        <div className="flex justify-center">
          <div className="flex flex-col items-center w-[300px] py-10">
            {/*  言語選択UI */}
            <div className="mb-10 w-full">
              <h2 className="mb-3 font-bold">言語を選ぶ</h2>
              <div className="flex justify-between">
                <button className={`${selectedLanguage === 'English' ? 'bg-blue-400' : 'bg-stone-400'}  w-[120px] px-5 py-1 mr-5 text-center rounded-md`} onClick={() => setSelectedLanguage('English')}>English</button>
                <button className={`${selectedLanguage === '中文' ? 'bg-blue-400' : 'bg-stone-400'}  w-[120px] px-5 py-1 text-center rounded-md`} onClick={() => setSelectedLanguage('中文')}>中文</button>
              </div>
            </div>
            {/* プロフィール表示・更新UI */}
            <div className="w-full">
              <Profile/>
            </div>
            {/* アバターの変更UI */}
            <div className="w-full">
              <h2 className="font-bold mb-5">アバターを選ぶ</h2>
              <select className="rounded-md p-2 mb-5" placeholder="選択する" onChange={(e)=> handleChangeAvatar(e)}>
                <option value="" disabled selected>選択してください</option>
                {
                  avatars.map((avatar,index)=> {
                    return (
                      <option key={index} value={avatar.path}>{avatar.label}</option>
                    );
                  })
                }
              </select>
            </div>
            {/* 背景の変更UI */}
            <div className="w-full">
              <h2 className="font-bold mb-5">背景を選ぶ</h2>
              <select className="rounded-md p-2 mb-5" placeholder="選択する" onChange={(e)=> handleChangeBackgroundImage(e)}>
                <option value="" disabled selected>選択してください</option>
                {
                  backgroundImages.map((image,index)=> {
                    return (
                      <option key={index} value={image.path}>{image.label}</option>
                    );
                  })
                }
              </select>
            </div>
            {/* 背景の変更UI */}
            <div className="w-full">
              <h2 className="font-bold mb-5">合成音声の種類を選ぶ</h2>
              <select className="rounded-md p-2 mb-5" placeholder="選択する" onChange={(e)=> handleChangeVoiceApi(e)}>
                <option value="" disabled selected>選択してください</option>
                {
                  textToSpeechApiTypeList.map((textToSpeechApi,index)=> {
                    return (
                      <option key={index} value={textToSpeechApi.value}>{textToSpeechApi.label}</option>
                    );
                  })
                }
              </select>
            </div>
            {/* サインアウトボタン */}
            <div className="w-full">
              <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => signout()}>サインアウト</button>
            </div>
          </div>
        </div>
      </div>
    )
  };

  return(
    <div className="">
      {/* SP版:上部のUI群 */}
      {isChatLogExpanded ? 
        <></> 
        : 
        <div className="flex h-12 justify-between m-2 pt-2">
          <TranslateToggleSwitch/>
          <div className="flex z-10">
            <EndTalkButton/>
            <FaRegSun className="text-white text-[34px] self-center" onClick={handleClickSettingButton}/>
          </div>
        </div>  
      }

      {
        // ヒント表示領域
        showHint ? 
          <div className="hint-container opacity-80 w-screen h-screen -z-0 top-12 flex fixed">{/* ヒント領域のコンテナ。画面いっぱいに広げて、中のヒント領域をflex/items-centerで画面の中央に配置(他のUIをさわれなくならないよう微調整済み) */}
            <div className="w-full flex items-center max-w-[900px] justify-center m-auto">
              {/* ヒントかボタンのどちらかを表示 */}
              <div className="w-[95%] h-[120px] bg-black opacity-75 text-white rounded-3xl m-auto relative -top-8  px-5 py-3 overflow-y-scroll">
                これはヒントです。これはヒントです。これはヒントです。これはヒントです。
                これはヒントです。これはヒントです。これはヒントです。これはヒントです。
                これはヒントです。これはヒントです。これはヒントです。これはヒントです。
                これはヒントです。
                これはヒントです。これはヒントです。これはヒントです。これはヒントです。
                これはヒントです。これはヒントです。これはヒントです。これはヒントです。
                これはヒントです。これはヒントです。これはヒントです。これはヒントです。
                これはヒントです。
              </div>
              {/* <div className="grid grid-cols-2 w-[95%] m-auto relative -top-8">
                <div className="bg-black opacity-75 cursor-pointer rounded-md w-[95%] h-10 m-auto  my-3 px-2 text-center flex items-center justify-center">ボタン1ボタン1ボタン1ボタン</div>
                <div className="bg-black opacity-75 cursor-pointer rounded-md w-[95%] h-10 m-auto  my-3 px-2 text-center flex items-center justify-center">ボタン2ボタン2ボタン2ボタン</div>
                <div className="bg-black opacity-75 cursor-pointer rounded-md  w-[95%] px-2 h-10 m-auto my-3 text-center flex items-center justify-center">ボタン3ボタン3ボタン3ボタン</div>
                <div className="bg-black opacity-75 cursor-pointer rounded-md  w-[95%] px-2 h-10 m-auto my-3 text-center flex items-center justify-center">ボタン4ボタン4ボタン4ボタン</div>
              </div> */}
            </div>
          </div>
          :
          <></>
      }

      {
        //セッティングモーダル
        showSetting ? 
          settingContainer()
          :
          <></>
      }

      {/* 下部のUI群 */}
      <div className="fixed bottom-0 flex flex-col  justify-between w-full">
        <div 
          onClick={() => handleExpandChatLog()}
          className={`z-10 relative flex justify-center cursor-pointer ${isChatLogExpanded ? '' : 'h-56'}`}
        >
          <div className={`px-6 h-full flex flex-col ${isChatLogExpanded ? 'w-screen h-screen  overflow-y-scroll py-5' : 'h-56 py-1 mask-top-fadeout top-0 absolute justify-end'}`}>
            {speechTextArea()}
          </div>
        </div>

        {
          isChatLogExpanded ? 
          <></>
          :
          <div className="w-full h-18 bg-[rgba(0,0,0,0.6)]  z-20  py-3 m-auto">
            {chatIconSelected ? 
              bottomUiChatIconSelected()
              : 
              bottomUiDefault()
            }
          </div>
        }
      </div>
    </div>
  );
};

export default UiForSp;