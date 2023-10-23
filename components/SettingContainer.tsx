import React, { ChangeEvent } from "react";
import { signOut } from "next-auth/react";
import { useAtom, useSetAtom } from "jotai";
import { MdClose } from "react-icons/md";
import {
  avatarPathAtom,
  backgroundImagePathAtom,
  currentAvatarAtom,
} from "../utils/atoms";
import {
  avatars,
  backgroundImages,
} from "../utils/constants";
import UserInfo from "./UserInfo";
import { HeaderLabel } from "./HeaderLabel";

interface SettingContainerProps {
  onClose: () => void;
}

export const SettingContainer: React.FC<SettingContainerProps> = ({
  onClose,
}) => {
  const [avatarPath, setAvatarPath] = useAtom(avatarPathAtom);
  const setCurrentAvatar = useSetAtom(currentAvatarAtom);
  const [backgroundImagePath, setBackgroundImagePath] = useAtom(
    backgroundImagePathAtom
  );

  const handleChangeAvatar = (e: ChangeEvent<HTMLSelectElement>) => {
    const currentAvatar = avatars.find(avatar => avatar.path === e.target.value);
    if(!currentAvatar)return;
    setCurrentAvatar(currentAvatar);
    setAvatarPath(e.target.value);
  };

  const handleChangeBackgroundImage = (e: ChangeEvent<HTMLSelectElement>) => {
    setBackgroundImagePath(e.target.value);
  };


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
