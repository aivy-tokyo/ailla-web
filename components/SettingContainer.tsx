import React from "react";
import { MdClose } from "react-icons/md";
import {AiOutlineArrowLeft} from "react-icons/ai";
import UserInfo from "./UserInfo";


interface SettingContainerProps {
  onClose: () => void;
}

export const SettingContainer: React.FC<SettingContainerProps> = ({
  onClose,
}) => {
  return (
    <div className="w-screen h-screen bg-gradient-user-info z-30 top-0 fixed overflow-y-scroll">
      <div className="flex justify-center">
        <div className="flex flex-col items-center w-[300px] py-10">
          {/* ユーザー情報表示・更新UI */}
          <div className="w-full pb-3 border-b-2">
            <UserInfo onClose={onClose}/>
          </div>
        </div>
      </div>
    </div>
  );
};
