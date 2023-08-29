import React, { ChangeEvent } from 'react';
import { signOut } from 'next-auth/react';
import { useSetAtom } from 'jotai';
import { FaRegTimesCircle } from 'react-icons/fa';
import { avatarPathAtom, backgroundImagePathAtom, textToSpeechApiTypeAtom } from '../utils/atoms';
import { avatars, backgroundImages, textToSpeechApiTypeList } from '../utils/constants';
import { SelectedLanguageType, TextToSpeechApiType } from '../utils/types';
import UserInfo from './UserInfo';

interface SettingContainerProps {
  onClose: () => void;
}

export const SettingContainer: React.FC<SettingContainerProps> = ({ onClose }) => {
  const setAvatarPath = useSetAtom(avatarPathAtom);
  const setBackgroundImagePath = useSetAtom(backgroundImagePathAtom);
  const setTextToSpeechApiType = useSetAtom(textToSpeechApiTypeAtom);
  
  const handleChangeAvatar = (e: ChangeEvent<HTMLSelectElement>) => {
    setAvatarPath(e.target.value);
  };

  const handleChangeBackgroundImage = (e: ChangeEvent<HTMLSelectElement>) => {
    setBackgroundImagePath(e.target.value);
  };

  const handleChangeVoiceApi = (e: ChangeEvent<HTMLSelectElement>) => {
    setTextToSpeechApiType(e.target.value as TextToSpeechApiType);
  };


  return (
    <div className="w-screen h-screen opacity-90 bg-black z-30 top-0 fixed text-white overflow-y-scroll">
      <div className="flex justify-end  fixed top-0 right-0 mt-2 cursor-pointer">
        <FaRegTimesCircle
          className="text-white text-[34px] "
          onClick={onClose}
        />
      </div>
      <div className="flex justify-center">
        <div className="flex flex-col items-center w-[300px] py-10">
          {/*  言語選択UI ※現状多言語対応がないためコメントアウト */}
          {/* <div className="mb-10 w-full">
            <h2 className="mb-3 font-bold">言語を選ぶ</h2>
            <div className="flex justify-between">
              <button
                className={`${
                  selectedLanguage === "English"
                    ? "bg-blue-400"
                    : "bg-stone-400"
                }  w-[120px] px-5 py-1 mr-5 text-center rounded-md`}
                onClick={() => setSelectedLanguage("English")}
              >
                English
              </button>
              <button
                className={`${
                  selectedLanguage === "中文" ? "bg-blue-400" : "bg-stone-400"
                }  w-[120px] px-5 py-1 text-center rounded-md`}
                onClick={() => setSelectedLanguage("中文")}
              >
                中文
              </button>
            </div>
          </div> */}
          {/* プロフィール表示・更新UI */}
          <div className="w-full">
            <UserInfo />
          </div>
          {/* アバターの変更UI */}
          <div className="w-full">
            <h2 className="font-bold mb-5">アバターを選ぶ</h2>
            <select
              className="rounded-md p-2 mb-5"
              placeholder="選択する"
              onChange={(e) => handleChangeAvatar(e)}
            >
              <option value="" disabled selected>
                選択してください
              </option>
              {avatars.map((avatar, index) => {
                return (
                  <option key={index} value={avatar.path}>
                    {avatar.label}
                  </option>
                );
              })}
            </select>
          </div>
          {/* 背景の変更UI */}
          <div className="w-full">
            <h2 className="font-bold mb-5">背景を選ぶ</h2>
            <select
              className="rounded-md p-2 mb-5"
              placeholder="選択する"
              onChange={(e) => handleChangeBackgroundImage(e)}
            >
              <option value="" disabled selected>
                選択してください
              </option>
              {backgroundImages.map((image, index) => {
                return (
                  <option key={index} value={image.path}>
                    {image.label}
                  </option>
                );
              })}
            </select>
          </div>
          {/* 背景の変更UI */}
          <div className="w-full">
            <h2 className="font-bold mb-5">合成音声の種類を選ぶ</h2>
            <select
              className="rounded-md p-2 mb-5"
              placeholder="選択する"
              onChange={(e) => handleChangeVoiceApi(e)}
            >
              <option value="" disabled selected>
                選択してください
              </option>
              {textToSpeechApiTypeList.map((textToSpeechApi, index) => {
                return (
                  <option key={index} value={textToSpeechApi.value}>
                    {textToSpeechApi.label}
                  </option>
                );
              })}
            </select>
          </div>
          {/* サインアウトボタン */}
          <div className="w-full">
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
