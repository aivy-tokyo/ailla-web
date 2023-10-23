import React, { useState, ChangeEvent } from "react";
import { signOut } from "next-auth/react";
import { useAtom, useSetAtom } from "jotai";
import { IoLogOutOutline } from "react-icons/io5";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { HeaderLabel } from "./HeaderLabel";
import { useUserInfo } from "@/hooks/useUserInfo";
import { avatars, backgroundImages } from "../utils/constants";
import {
  avatarPathAtom,
  backgroundImagePathAtom,
  currentAvatarAtom,
} from "../utils/atoms";

const UserInfoItem = ({
  label,
  value,
  id,
}: {
  label: string;
  value: string | undefined;
  id: string;
}) => {
  return (
    <div className="flex justify-left w-3/5 my-4">
      <label htmlFor={id} className="w-2/5">
        <HeaderLabel>{label}</HeaderLabel>
      </label>
      <div className="w-2/5">
        <p id={id} className="text-[#47556D] text-left text-base">
          {value}
        </p>
      </div>
    </div>
  );
};

export const UserInfoDisplay = ({
  onClose,
  setIsEditMode,
}: {
  onClose: () => void;
  setIsEditMode: (item: boolean) => void;
}) => {
  const { userInfo } = useUserInfo();
  const [avatarPath, setAvatarPath] = useAtom(avatarPathAtom);
  const setCurrentAvatar = useSetAtom(currentAvatarAtom);
  const [backgroundImagePath, setBackgroundImagePath] = useAtom(
    backgroundImagePathAtom,
  );
  const handleChangeAvatar = (e: ChangeEvent<HTMLSelectElement>) => {
    const currentAvatar = avatars.find(
      (avatar) => avatar.path === e.target.value,
    );
    if (!currentAvatar) return;
    setCurrentAvatar(currentAvatar);
    setAvatarPath(e.target.value);
  };
  const handleChangeBackgroundImage = (e: ChangeEvent<HTMLSelectElement>) => {
    setBackgroundImagePath(e.target.value);
  };

  return (
    <div>
      <button className="my-1" onClick={onClose}>
        <AiOutlineArrowLeft className="font-bold text-[#47556D] my-3 h-[1.2rem] w-[1.2rem]" />
      </button>
      <div className="flex justify-between items-center mb-5">
        <p className="font-bold text-[#47556D] text-2xl">ユーザー情報</p>
      </div>
      <UserInfoItem label="名前" value={userInfo?.name} id="name" />
      <UserInfoItem
        label="都道府県"
        value={userInfo?.prefecture}
        id="prefecture"
      />
      <UserInfoItem
        label="生年月日"
        value={userInfo?.birthdate}
        id="birthdate"
      />
      <UserInfoItem label="性別" value={userInfo?.gender} id="gender" />
      <button
        className="
                border-[1px] border-solid border-[#47556D]
                mr-2 px-[1rem] py-[0.5rem] rounded-[0.8rem]
                text-[1rem] text-[#47556D]
                "
        onClick={() => setIsEditMode(true)}
      >
        編集する
      </button>
      <div className="flex justify-center relative w-full h-[1px] my-5 border-[#CED4DE] border-b" />
      <h1 className="text-[#47556D] font-bold text-[1.5rem]">各種設定</h1>
      {/* アバターの変更UI */}
      <div className="w-full my-5">
        <HeaderLabel>アバターを選ぶ</HeaderLabel>
        <select
          className="select select-bordered rounded-[0.7rem] w-full max-w-xs bg-white h-[2rem] mt-2"
          onChange={(e) => handleChangeAvatar(e)}
          value={avatarPath}
        >
          {avatars.map((avatar, index) => {
            return (
              <option
                key={index}
                value={avatar.path}
                className="text-[#47556D]"
              >
                {avatar.label}
              </option>
            );
          })}
        </select>
      </div>
      {/* 背景の変更UI */}
      <div className="w-full my-5">
        <HeaderLabel>背景を選ぶ</HeaderLabel>
        <select
          className="select select-bordered rounded-[0.7rem] w-full max-w-xs bg-white h-[2rem] mt-2"
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
      <div className="w-full my-3">
        <button
          className="flex justify-start items-center py-2 rounded text-red-500"
          onClick={() => signOut()}
        >
          <span className="">サインアウト</span>
          <IoLogOutOutline className="ml-1" />
        </button>
      </div>
    </div>
  );
};
