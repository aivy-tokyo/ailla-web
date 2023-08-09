import { isTranslatedAtom } from "@/utils/atoms";
import { useAtom, useAtomValue } from "jotai";
import { ChangeEvent } from "react";

const TranslateToggleSwitch = () => {
  const [isTranslated, setIsTranslated] = useAtom(isTranslatedAtom);
  const handleTranslate = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.checked);
    if(e.target.checked){
      setIsTranslated(true);
    }else{
      setIsTranslated(false);
    }
  };

  return (
    <label className="cursor-pointer flex items-center relative">
    {isTranslated ?
      <span className="absolute left-2 text-xs">OFF</span>
      :
      <span className="absolute right-2 text-xs">ON</span> 
    }
    <input type="checkbox" className="toggle toggle-lg toggle-info" checked={isTranslated} onChange={handleTranslate}/>
  </label>
  );
};

export default TranslateToggleSwitch;