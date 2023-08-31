import { isTranslatedAtom } from "@/utils/atoms";
import { useAtom } from "jotai";

const TranslateToggleSwitch = () => {
  const [isTranslated, setIsTranslated] = useAtom(isTranslatedAtom);
  const handleTranslate = () => {
    setIsTranslated((prev) => !prev);
  };

  return (
    <div className={`relative w-[64px] h-[31px] border cursor-pointer ${isTranslated ? 'border-sky-500 bg-sky-400' : 'border-slate-500 bg-slate-800'} text-stone-300 rounded-full flex items-center px-[1px]`} onClick={() => handleTranslate()}>
      <div className={`w-[26px] h-[26px] rounded-full self-center transform transition-transform  ease-in-out duration-200 ${isTranslated ? 'translate-x-[33px] bg-sky-500' : 'translate-x-0 bg-slate-700' }`}></div>
      {isTranslated ?
        <span className="absolute left-2 text-xs">翻訳</span>
        :
        <span className="absolute right-2 text-xs">翻訳</span> 
      }
    </div>
  );
};

export default TranslateToggleSwitch;