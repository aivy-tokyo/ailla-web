import { useState } from "react";

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


export const UiContainer = () => {
  const [isTranslated, setIsTranslated] = useState<boolean>(false);
  const handleTranslate = () => {
    setIsTranslated(prev => !prev);
  };

  const speechTextArea = () => {
    return  dummyUsersData.map((userData,id) => (
      <div className="flex">
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
        {/* 翻訳ON/OFFトグルスイッチ */}
        <label className="cursor-pointer flex items-center relative">
          {isTranslated ?
            <span className="absolute left-2 text-xs">OFF</span>
            :
            <span className="absolute right-2 text-xs">ON</span> 
          }
          <input type="checkbox" className="toggle toggle-lg toggle-info" onChange={() => handleTranslate()}/>
        </label>
        <div className="flex">
          {/* シチュエーション会話終了ボタン */}
          <button className="bg-red-400 w-28 text-black font-bold rounded-md flex justify-center items-center mr-2">
            <span>終了</span>
          </button>
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
}