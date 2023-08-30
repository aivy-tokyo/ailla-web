import { prefectures } from "@/utils/constants";
import { Prefecture, UserGenderType, UserProfile } from "@/utils/types";
import {
  FormEvent,
  useCallback,
  useState,
} from "react";
import { useRouter } from "next/router";
import { useAtom } from "jotai";
import { userIdAtom } from "@/utils/atoms";
import axios from 'axios';
import { FaRegTimesCircle } from "react-icons/fa";

export default function RegisterPage() {
  const [userName, setUserName] = useState("");
  const [userPrefecture, setUserPrefecture] = useState<Prefecture>();
  const [userBirthday, setUserBirthday] = useState<string>("");
  const [userGender, setUserGender] = useState<UserGenderType>("選択しない");
  const [isSendingRequest, setIsSendingRequest] = useState(false);
  const [isResultError, setIsResultError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const router = useRouter();
  const [userId, setUserId] = useAtom(userIdAtom);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      try {
        let errors = [];

        if (!userName) {
            errors.push('ユーザー名');
        }
        if (!userPrefecture) {
            errors.push('都道府県');
        }
        if (!userBirthday) {
            errors.push('誕生日');
        }
        if (!userGender) {
            errors.push('性別');
        }

        if (errors.length > 0) {
            setIsResultError(true);
            throw new Error(`${errors.join(', ')} が未入力です`);
        }
        setIsSendingRequest(true);

        const response = await axios.put('/api/user', {
          id: userId,
          userName,
          userPrefecture,
          userBirthday,
          userGender,
        });

        const data: UserProfile = await response.data;
        setUserId(data.id.S);
        setUserName(data.userName.S);
        setUserPrefecture(data.userPrefecture.S);
        setUserBirthday(data.userBirthday.S);
        setUserGender(data.userGender.S);

        router.push("/");
      } catch (error: unknown) {
        console.log(error);
        setIsResultError(true);

        if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
            setErrorMessage('Error occurred.');
        }

      } finally {
        setTimeout(() => {
          setIsResultError(false);
        }, 3000);
        setIsSendingRequest(false);
      }
    },
    [
      userName,
      userPrefecture,
      userBirthday,
      userGender,
      userId,
      setUserId,
      router,
    ]
  );

  return (
    <div className="flex h-full text-black text-center">
      {
         isSendingRequest && 
          <button className="btn fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <span className="loading loading-spinner"></span>
            登録中...
          </button>
       }
       {
          isResultError &&
          <div className="alert alert-error fixed top-2 left-1/2 w-[40vw] transform -translate-x-1/2">
            <FaRegTimesCircle
              className="text-black text-[34px] "
            />
            <span>{errorMessage}</span>
          </div>
       }
      <div className="bg-stone-300 rounded-xl bg-opacity-90 w-[500px] h-fit m-auto pt-5 flex flex-col items-center">
        <h2 className="text-2xl">新規登録</h2>
        <form onSubmit={handleSubmit} className="w-[80%] my-5">
          <div className="mb-5">
            <label htmlFor="">名前：</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="rounded-md p-2 w-full text-white bg-slate-900"
            />
          </div>

          <div className="flex flex-col mb-5">
            <label>都道府県：</label>
            <select
              className="text-white rounded-md p-2 mb-5 bg-slate-900"
              value={userPrefecture}
              onChange={(e) => setUserPrefecture(e.target.value as Prefecture)}
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
            <input
              type="text"
              className="text-white rounded-md p-2 mb-5 bg-slate-900"
              value={userBirthday}
              onChange={(e) => setUserBirthday(String(e.target.value))}
            />

            <label htmlFor="">性別：</label>
            <select
              name=""
              id=""
              value={userGender}
              className="text-white rounded-md p-2 mb-5 bg-slate-900"
              onChange={(e) => setUserGender(e.target.value as UserGenderType)}
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
}
