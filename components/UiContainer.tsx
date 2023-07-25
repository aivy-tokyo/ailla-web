import { useState } from "react";

export const UiContainer = () => {
  const [isTranslated, setIsTranslated] = useState<boolean>(false);
  const handleTranslate = () => {
    setIsTranslated(prev => !prev);
  };
  return(
    <div className=" p-2">
      <div className="flex h-10 justify-between">
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
          <button className="bg-red-400 w-32  rounded-md flex justify-center items-center mr-2">
            <span>終了</span>
          </button>
          <img src="/setting.png" alt="" className="w-auto"/>
        </div>
      </div>
    </div>
  );
}