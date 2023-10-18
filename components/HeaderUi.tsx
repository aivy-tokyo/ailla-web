import { FaRegQuestionCircle, FaRegSun } from "react-icons/fa";
import EndTalkButton from "./EndTalkButton";
import TranslateToggleSwitch from "./TranslateToggleSwitch";
import { SettingContainer } from "./SettingContainer";
import { useState } from "react";
import { HelpDialog } from "./HelpDialog";
import { Situation } from "@/utils/types";

type HeaderUiProps = {
  onClickEndTalk?: () => void;
  isSituation?: Situation | null | undefined;
};
export const HeaderUi: React.FC<HeaderUiProps> = ({
  onClickEndTalk,
  isSituation,
}) => {
  const [showSetting, setShowSetting] = useState<boolean>(false);
  const modalHelp = document.getElementById("modal_help") as HTMLDialogElement;

  return (
    <>
      <div className="z-1 fixed top-5 w-full flex justify-between items-center my-2 px-2 ">
        {/* 機能未実装のため */}
        <TranslateToggleSwitch isSituation={isSituation} />
        <div className="self-end ml-auto flex items-center gap-2">
          {onClickEndTalk ? (
            <EndTalkButton onClick={onClickEndTalk} />
          ) : (
            <div className="flex justify-end gap-2">
              <button>
                <FaRegQuestionCircle
                  className="opacity-60 text-white"
                  size={28}
                  onClick={() => {
                    modalHelp.showModal();
                  }}
                />
              </button>
              <button
                className="btn btn-icon btn-ghost btn-sm"
                onClick={() => setShowSetting(true)}
              >
                <FaRegSun className="opacity-60 text-white" size={28} />
              </button>
            </div>
          )}
        </div>
      </div>
      {showSetting && (
        <SettingContainer onClose={() => setShowSetting(false)} />
      )}
      <HelpDialog />
    </>
  );
};
