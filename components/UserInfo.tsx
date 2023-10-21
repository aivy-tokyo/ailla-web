import { FaRegTimesCircle } from "react-icons/fa";
import { Prefecture, UserGenderType } from "@/utils/types";
import { prefectures } from "@/utils/constants";
import { useUserInfo } from "@/hooks/useUserInfo";
import { useCallback, useState } from "react";
import { HeaderLabel } from "./HeaderLabel";
import * as Sentry from "@sentry/nextjs";

const UserInfo = () => {
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
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between items-center mb-5">
            <button
              className="btn btn-neutral btn-sm"
              onClick={() => setIsEditMode(false)}
            >
              キャンセル
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              更新する
            </button>
          </div>
          <div className="flex flex-col mb-5">
            <label htmlFor="name">
              <HeaderLabel>名前(ローマ字)：</HeaderLabel>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="input"
              placeholder="例：Ailla"
              pattern="[A-Za-z0-9]+"
              title="英数字のみ入力してください"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="flex flex-col mb-5">
            <label htmlFor="prefecture">
              <HeaderLabel>都道府県：</HeaderLabel>
            </label>
            <select
              id="prefecture"
              className="select select-bordered w-full max-w-xs"
              value={prefecture}
              onChange={(e) => setPrefecture(e.target.value as Prefecture)}
            >
              {prefectures.map((prefecture, index) => {
                return (
                  <option key={index} value={prefecture}>
                    {prefecture}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="flex flex-col mb-5">
            <label htmlFor="birthdate">
              <HeaderLabel>生年月日：</HeaderLabel>
            </label>
            <div className="flex">
              <input
                id="year"
                name="year"
                type="number"
                className="input w-1/3 mr-1 px-1"
                pattern="\d{4}"
                title="数字のみ入力してください"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
              <div className="flex items-center">年</div>
              <input
                id="month"
                name="month"
                type="string"
                className="input w-1/4 mr-1 px-1"
                pattern="\d{1,2}"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              />
              <div className="flex items-center">月</div>
              <input
                id="day"
                name="day"
                type="string"
                className="input w-1/4 mr-1 padding-x-1"
                pattern="\d{1,2}"
                value={day}
                onChange={(e) => setDay(e.target.value)}
              />
              <div className="flex items-center">日</div>
            </div>
          </div>

          <div className="flex flex-col mb-5">
            <label htmlFor="gender">
              <HeaderLabel>性別：</HeaderLabel>
            </label>
            <select
              id="gender"
              className="select select-bordered w-full max-w-xs"
              value={gender}
              onChange={(e) => setGender(e.target.value as UserGenderType)}
            >
              <option value="男性">男性</option>
              <option value="女性">女性</option>
              <option value="選択しない">選択しない</option>
            </select>
          </div>

          <div className="flex justify-between items-center my-10">
            <button
              className="btn btn-error btn-xs w-full"
              onClick={handleUserDelete}
            >
              ユーザー情報を削除する
            </button>
          </div>
        </form>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-5">
            <p className="font-bold text-white text-2xl">ユーザー情報</p>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setIsEditMode(true)}
            >
              編集する
            </button>
          </div>
          <div className="flex items-center mb-5">
            <label htmlFor="name">
              <HeaderLabel>名前：</HeaderLabel>
            </label>
            <p id="name" className="text-white text-xl mt-5 mb-3">
              {userInfo?.name}
            </p>
          </div>
          <div className="flex items-center mb-5">
            <label htmlFor="prefecture">
              <HeaderLabel>都道府県：</HeaderLabel>
            </label>
            <p id="prefecture" className="text-white text-xl mt-5 mb-3">
              {userInfo?.prefecture}
            </p>
          </div>
          <div className="flex items-center mb-5">
            <label htmlFor="birthdate">
              <HeaderLabel>生年月日：</HeaderLabel>
            </label>
            <p id="birthdate" className="text-white text-xl mt-5 mb-3">
              {userInfo?.birthdate}
            </p>
          </div>
          <div className="flex items-center mb-5">
            <label htmlFor="gender">
              <HeaderLabel>性別：</HeaderLabel>
            </label>
            <p id="gender" className="text-white text-xl mt-5 mb-3">
              {userInfo?.gender}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
