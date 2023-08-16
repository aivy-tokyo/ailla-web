import { FaRegSun } from "react-icons/fa";
import EndTalkButton from "./EndTalkButton";
import TranslateToggleSwitch from "./TranslateToggleSwitch";
import { SettingContainer } from "./SettingContainer";
import { useState } from "react";

type HeaderUiProps = {
  onClickEndTalk?: () => void;
};
export const HeaderUi: React.FC<HeaderUiProps> = ({ onClickEndTalk }) => {
  const [showSetting, setShowSetting] = useState<boolean>(false);

  return (
    <>
      <div className="z-1 fixed top-0 w-full flex h-12 justify-between items-center my-2 px-2">
        <TranslateToggleSwitch />
        <div className="flex items-center gap-2">
          {onClickEndTalk && <EndTalkButton onClick={onClickEndTalk} />}
          <button className="btn btn-icon btn-ghost btn-sm" onClick={() => setShowSetting(true)}>
            <FaRegSun className="text-white self-center" />
          </button>
        </div>
      </div>
      {showSetting && (
        <SettingContainer onClose={() => setShowSetting(false)} />
      )}
    </>
  );
};
