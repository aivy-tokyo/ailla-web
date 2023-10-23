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
          {/* アバターの変更UI */}
          <div className="w-full">
            <HeaderLabel>アバターを選ぶ</HeaderLabel>
            <select
              className="select select-bordered w-full max-w-xs bg-white"
              onChange={(e) => handleChangeAvatar(e)}
              value={avatarPath}
            >
              {avatars.map((avatar, index) => {
                return (
                  <option key={index} value={avatar.path} className="text-[#47556D]">
                    {avatar.label}
                  </option>
                );
              })}
            </select>
          </div>
          {/* 背景の変更UI */}
          <div className="w-full">
            <HeaderLabel>背景を選ぶ</HeaderLabel>
            <select
              className="select select-bordered w-full max-w-xs bg-white"
              onChange={(e) => handleChangeBackgroundImage(e)}
              value={backgroundImagePath}
            >
              {backgroundImages.map((image, index) => {
                return (
                  <option key={index} value={image.path}>
                    {image.label}
                  </option>
                );
              })}
            </select>
          </div>
          {/* サインアウトボタン */}
          <div className="w-full my-10">
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => signOut()}
            >
              サインアウト
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
