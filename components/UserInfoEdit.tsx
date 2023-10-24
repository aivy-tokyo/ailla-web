import React, { useCallback, useState } from "react";
import { useUserInfo } from "@/hooks/useUserInfo";
import * as Sentry from "@sentry/nextjs";
import { Prefecture, UserGenderType } from "@/utils/types";
import { prefectures } from "@/utils/constants";
import { HeaderLabel } from "./HeaderLabel";

type InputFieldProps = {
  label: string;
  children: React.ReactNode;
};

const InputField: React.FC<InputFieldProps> = ({ label, children }) => {
  return (
    <div className="flex flex-col my-6">
      <label className="my-2">
        <HeaderLabel>{label}</HeaderLabel>
      </label>
      {children}
    </div>
  );
};

type UserInfoEditProps = {
  setIsEditMode: (item: boolean) => void;
  setIsResultError: (item: boolean) => void;
  setIsSendingRequest: (item: boolean) => void;
  setErrorMessage: (item: string) => void;
};
export const UserInfoEdit: React.FC<UserInfoEditProps> = ({
  setIsEditMode,
  setIsResultError,
  setIsSendingRequest,
  setErrorMessage,
}) => {
  const { editUserInfo, deleteUserInfo, userInfo } = useUserInfo();

  const [name, setName] = useState<string>(userInfo?.name as string);
  const [prefecture, setPrefecture] = useState<Prefecture>(
    userInfo?.prefecture as Prefecture,
  );
  const [birthdate, setBirthdate] = useState<string>(
    userInfo?.birthdate as string,
  );
  const [gender, setGender] = useState<UserGenderType>(
    userInfo?.gender as UserGenderType,
  );

  const handleUserDelete = useCallback(() => {
    const ok = confirm("ユーザーを削除しますか？");
    if (ok) {
      deleteUserInfo();
    }
  }, [deleteUserInfo]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
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

  return (
    <form onSubmit={handleSubmit}>
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
        <input
          id="birthdate"
          name="birthdate"
          className="input bg-white text-[#47556D]"
          pattern="\d{4}\/\d{2}\/\d{2}"
          title="誕生日のフォーマットは YYYY/MM/DD です"
          value={birthdate}
          onChange={(e) => setBirthdate(e.target.value)}
        />
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
  );
};
