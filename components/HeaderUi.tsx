import { FaRegSun } from "react-icons/fa";
import EndTalkButton from "./EndTalkButton";
import TranslateToggleSwitch from "./TranslateToggleSwitch";
import { SettingContainer } from "./SettingContainer";
import { useState } from "react";

type HeaderUiProps = {};
export const HeaderUi: React.FC<HeaderUiProps> = () => {
  const [showSetting, setShowSetting] = useState<boolean>(false);

  return (
    <>
      <div className="flex h-12 justify-between m-2 pt-2">
        <TranslateToggleSwitch />
        <div className="flex">
          <EndTalkButton />
          <FaRegSun
            className="text-white text-[34px] self-center"
            onClick={() => setShowSetting(true)}
          />
        </div>
      </div>
      {showSetting && (
        <SettingContainer onClose={() => setShowSetting(false)} />
      )}
    </>
  );
};
