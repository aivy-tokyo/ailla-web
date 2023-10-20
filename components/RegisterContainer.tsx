import { useRouter } from "next/router";
import { useState, useCallback, FormEvent } from "react";
import { FaRegTimesCircle } from "react-icons/fa";
import { prefectures } from "../utils/constants";
import { Prefecture, UserGenderType } from "../utils/types";
import { useUserInfo } from "@/hooks/useUserInfo";

export const RegisterContainer: React.FC = () => {
  const { registerUserInfo, userInfo } = useUserInfo();

  const [name, setName] = useState("");
  const [prefecture, setPrefecture] = useState<Prefecture>("選択しない");
  const [birthdate, setBirthdate] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [month, setMonth] = useState<string>("");
  const [day, setDay] = useState<string>("");

  const [gender, setGender] = useState<UserGenderType>("選択しない");
  const [isSendingRequest, setIsSendingRequest] = useState(false);
  const [isResultError, setIsResultError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const router = useRouter();

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      // month, dayが1桁の場合は0埋め
      const paddedMonth = month.padStart(2, "0");
      const paddedDay = day.padStart(2, "0");
      setMonth(paddedMonth);
      setDay(paddedDay);

      await setMonth(paddedMonth);
      await setDay(paddedDay);

      const birthdate = `${year}/${paddedMonth}/${paddedDay}`;
      setBirthdate(birthdate);

      try {
        let errors = [];
        if (!name) {
          errors.push("ユーザー名が未入力です");
        }
        if (!prefecture) {
          errors.push("都道府県が未選択です");
        }
        if (!birthdate) {
          errors.push("誕生日が未入力です");
        }
        if (!gender) {
          errors.push("性別が未選択です");
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
        await registerUserInfo(name, prefecture, birthdate, gender);
        router.push("/");
      } catch (error: unknown) {
        console.log(error);
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
    },
    [month, day, year, name, prefecture, gender, registerUserInfo, router],
  );

  return (
    <div className="flex h-full text-black text-center">
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
      <div className="bg-stone-300 rounded-xl bg-opacity-90 w-[500px] h-fit m-auto pt-5 flex flex-col items-center">
        <h2 className="text-2xl">新規登録</h2>
        <form onSubmit={handleSubmit} className="w-[80%] my-5">
          <div className="mb-5">
            <label htmlFor="">名前(ローマ字)：</label>
            <input
              type="text"
              value={name}
              placeholder="例：Ailla"
              pattern="[A-Za-z0-9]+" // 英数字のみ
              onChange={(e) => setName(e.target.value)}
              className="rounded-md p-2 w-full text-white bg-slate-900"
            />
          </div>

          <div className="flex flex-col mb-5">
            <label>都道府県：</label>
            <select
              className="text-white rounded-md p-2 mb-5 bg-slate-900"
              value={prefecture}
              onChange={(e) => setPrefecture(e.target.value as Prefecture)}
            >
              <option value="" selected disabled>
                選択してください
              </option>
              {prefectures.map((prefecture, index) => {
                return (
                  <option key={index} value={prefecture}>
                    {prefecture}
                  </option>
                );
              })}
            </select>

            <span>生年月日：</span>
            <div className="flex">
              <input
                type="text"
                className="text-white w-1/3 rounded-md p-2 mb-5 bg-slate-900 mx-1"
                value={year}
                onChange={(e) => setYear(String(e.target.value))}
              />
              <div className="flex items-center">年</div>
              <input
                type="text"
                className="text-white w-1/4 rounded-md p-2 mb-5 bg-slate-900 mx-1"
                value={month}
                onChange={(e) => setMonth(String(e.target.value))}
              />
              <div className="flex items-center">月</div>
              <input
                type="text"
                className="text-white w-1/4 rounded-md p-2 mb-5 bg-slate-900 mx-1"
                value={day}
                onChange={(e) => setDay(String(e.target.value))}
              />
              <div className="flex items-center">日</div>
            </div>

            <label htmlFor="">性別：</label>
            <select
              name=""
              id=""
              value={gender}
              className="text-white rounded-md p-2 mb-5 bg-slate-900"
              onChange={(e) => setGender(e.target.value as UserGenderType)}
            >
              <option value="男性">男性</option>
              <option value="女性">女性</option>
              <option value="選択しない">選択しない</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-sky-500 border border-sky-600 rounded-full text-white font-bold py-3 px-5"
          >
            登録してはじめる
          </button>
        </form>
      </div>
    </div>
  );
};
