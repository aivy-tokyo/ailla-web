import React from "react";
import { MdClose } from "react-icons/md";
import UserInfo from "./UserInfo";

interface SettingContainerProps {
  onClose: () => void;
}

export const SettingContainer: React.FC<SettingContainerProps> = ({
  onClose,
}) => {
  return (
    <div className="w-screen h-screen bg-[#E3DDE8] z-30 top-0 fixed overflow-y-scroll">
      <div className="fixed top-0 right-0 p-3">
        <button
          className="text-white btn btn-circle btn-outline btn-xs"
          onClick={onClose}
        >
          <MdClose />
        </button>
      </div>
      <div className="flex justify-center">
        <div className="flex flex-col items-center w-[300px] py-10">
          {/* ユーザー情報表示・更新UI */}
          <div className="w-full pb-3 border-b-2">
            <UserInfo />
          </div>
        </div>
      </div>
    </div>
  );
};
