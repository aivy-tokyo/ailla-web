import React, { ChangeEvent } from "react";
import { signOut } from "next-auth/react";
import { useAtom, useSetAtom } from "jotai";
import { FaRegTimesCircle } from "react-icons/fa";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { IoLogOutOutline } from "react-icons/io5";
import { Prefecture, UserGenderType } from "@/utils/types";
import { prefectures } from "@/utils/constants";
import { useUserInfo } from "@/hooks/useUserInfo";
import { useCallback, useState } from "react";
import { HeaderLabel } from "./HeaderLabel";
import * as Sentry from "@sentry/nextjs";
import { avatars, backgroundImages } from "../utils/constants";
import {
  avatarPathAtom,
  backgroundImagePathAtom,
  currentAvatarAtom,
} from "../utils/atoms";

type InputFieldProps = {
  label: string;
  children: React.ReactNode;
};

const InputField: React.FC<InputFieldProps> = ({ label, children }) => {
  return (
    <div className="flex flex-col my-6">
      <label>
        <HeaderLabel>{label}</HeaderLabel>
      </label>
      {children}
    </div>
  );
};

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

const UserInfo = ({onClose}: {onClose: () => void}) => {
  const { editUserInfo, deleteUserInfo, userInfo } = useUserInfo();
  const [name, setName] = useState<string>(userInfo?.name as string);
  const [prefecture, setPrefecture] = useState<Prefecture>(
    userInfo?.prefecture as Prefecture,
  );
  const [birthdate, setBirthdate] = useState<string>(
    userInfo?.birthdate as string,
  );
  const [year, setYear] = useState<string>(
    userInfo?.birthdate.split("/")[0] as string,
  );
  const [month, setMonth] = useState<string>(
    userInfo?.birthdate.split("/")[1] as string,
  );
  const [day, setDay] = useState<string>(
    userInfo?.birthdate.split("/")[2] as string,
  );
  const [gender, setGender] = useState<UserGenderType>(
    userInfo?.gender as UserGenderType,
  );

  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isSendingRequest, setIsSendingRequest] = useState(false);
  const [isResultError, setIsResultError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [backgroundImagePath, setBackgroundImagePath] = useAtom(
    backgroundImagePathAtom,
  );
  const setCurrentAvatar = useSetAtom(currentAvatarAtom);
  const handleChangeAvatar = (e: ChangeEvent<HTMLSelectElement>) => {
    const currentAvatar = avatars.find(
      (avatar) => avatar.path === e.target.value,
    );
    if (!currentAvatar) return;
    setCurrentAvatar(currentAvatar);
    setAvatarPath(e.target.value);
  };
  const [avatarPath, setAvatarPath] = useAtom(avatarPathAtom);

  const handleChangeBackgroundImage = (e: ChangeEvent<HTMLSelectElement>) => {
    setBackgroundImagePath(e.target.value);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      // month, dayが1桁の場合は0埋め
      const paddedMonth = month.padStart(2, "0");
      const paddedDay = day.padStart(2, "0");

      setMonth(paddedMonth);
      setDay(paddedDay);

      await setMonth(paddedMonth);
      await setDay(paddedDay);

      const birthdate = `${year}/${paddedMonth}/${paddedDay}`;
      setBirthdate(birthdate);

      let errors = [];

      if (!name) {
        errors.push("ユーザー名が未入力です");
      }

      // nameが英数字のみかどうかチェック
      const nameRegex = /^[a-zA-Z0-9]+$/;
      if (!nameRegex.test(name)) {
        errors.push("ユーザー名は英数字のみ入力してください");
      }

      // birthdateが正しい日付かどうかチェック
      const inputBirthdate = new Date(birthdate);
      if (isNaN(inputBirthdate.getTime())) {
        errors.push("誕生日が正しい日付ではありません");
      }

      if (errors.length > 0) {
        setIsResultError(true);
        throw new Error(`${errors.join(", ")}`);
      }

      setIsSendingRequest(true);

      await editUserInfo(name, prefecture, birthdate, gender);
      setIsEditMode(false);
    } catch (error: unknown) {
      Sentry.captureException(error);
      setIsResultError(true);
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Error occurred.");
      }
    } finally {
      setTimeout(() => {
        setIsResultError(false);
      }, 3000);
      setIsSendingRequest(false);
    }
  };

  const handleUserDelete = useCallback(() => {
    const ok = confirm("ユーザーを削除しますか？");
    if (ok) {
      deleteUserInfo();
    }
  }, [deleteUserInfo]);

  return (
    <div className="w-full">
      {isSendingRequest && (
        <button className="btn fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <span className="loading loading-spinner"></span>
          登録中...
        </button>
      )}
      {isResultError && (
        <div className="alert alert-error fixed top-2 left-1/2 w-[40vw] transform -translate-x-1/2">
          <FaRegTimesCircle className="text-black text-[34px] " />
          <span>{errorMessage}</span>
        </div>
      )}
      {isEditMode ? (
        <form onSubmit={handleSubmit} className="bg-[#E3DDE8]">
          <h1 className="text-[#47556D] font-bold text-[1.5rem]">
            ユーザー情報の編集
          </h1>
          <InputField label="名前">
            <input
              id="name"
              name="name"
              type="text"
              className="input bg-white text-[#47556D]"
              placeholder="例：Ailla"
              pattern="[A-Za-z0-9]+"
              title="英数字のみ入力してください"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </InputField>
          <InputField label="都道府県">
            <select
              id="prefecture"
              className="select select-bordered w-full max-w-xs bg-white text-[#47556D]"
              value={prefecture}
              onChange={(e) => setPrefecture(e.target.value as Prefecture)}
            >
              {prefectures.map((pref, index) => (
                <option key={index} value={pref}>
                  {pref}
                </option>
              ))}
            </select>
          </InputField>
          <InputField label="生年月日">
            <div className="flex">
              <input
                id="year"
                name="year"
                type="number"
                className="input w-1/3 mr-1 px-1 bg-white text-[#47556D]"
                pattern="\d{4}"
                title="数字のみ入力してください"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
              <div className="flex items-center">
                <span className="text-[#47556D]">年</span>
              </div>
              <input
                id="month"
                name="month"
                type="string"
                className="input w-1/4 mr-1 bg-white px-1 text-[#47556D]"
                pattern="\d{1,2}"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              />
              <div className="flex items-center text-[#47556D]">月</div>
              <input
                id="day"
                name="day"
                type="string"
                className="input w-1/4 mr-1 padding-x-1 bg-white text-[#47556D]"
                pattern="\d{1,2}"
                value={day}
                onChange={(e) => setDay(e.target.value)}
              />
              <div className="flex items-center text-[#47556D]">日</div>
            </div>
          </InputField>
          <InputField label="性別">
            <select
              id="gender"
              className="select select-bordered w-full max-w-xs bg-white text-[#47556D]"
              value={gender}
              onChange={(e) => setGender(e.target.value as UserGenderType)}
            >
              <option value="男性">男性</option>
              <option value="女性">女性</option>
              <option value="選択しない">選択しない</option>
            </select>
          </InputField>
          <div className="flex justify-left mb-2">
            <button
              className="
                border-[1px] border-solid border-[#47556D]
                mr-2 px-[1rem] py-[0.5rem] rounded-[0.8rem]
                text-[1rem] text-[#47556D]
                "
              onClick={() => setIsEditMode(false)}
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="
            mr-2 px-[1rem] py-[0.5rem] rounded-[0.8rem]
            text-[1rem] text-white bg-gradient-pink
            "
            >
              更新する
            </button>
          </div>
          <div className="flex justify-between items-center my-7">
            <button
              className="w-full text-red-400 text-left"
              onClick={handleUserDelete}
            >
              ユーザー情報を削除する
            </button>
          </div>
        </form>
      ) : (
        <div>
          <button className="text-[#47556D] my-3" onClick={onClose}>
            <AiOutlineArrowLeft className="text-[#47556D] my-3 h-[1.2rem] w-[1.2rem]" />
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
      )}
    </div>
  );
};

export default UserInfo;
