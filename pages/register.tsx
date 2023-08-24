import { prefectures } from "@/utils/constants";
import { Prefecture, UserGenderType} from "@/utils/types";
import {
  FormEvent,
  useCallback,
  useState,
} from "react";
import { useRouter } from "next/router";
import { useAtomValue, useSetAtom } from "jotai";
import { userIdAtom, userInfoAtom } from "@/utils/atoms";
import axios from 'axios';
import { UserInfo } from "@/entities/UserInfo";

export default function RegisterPage() {
  const [userName, setUserName] = useState("");
  const [userPrefecture, setUserPrefecture] = useState<Prefecture>();
  const [userBirthday, setUserBirthday] = useState<string>("");
  const [userGender, setUserGender] = useState<UserGenderType>("選択しない");
  const setUserInfo = useSetAtom(userInfoAtom);

  const router = useRouter();
  const userId = useAtomValue(userIdAtom);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!userName || !userPrefecture || !userBirthday || !userGender) {
        console.log("userName", userName);
        console.log("userPrefecture", userPrefecture);
        console.log("userBirthday", userBirthday);
        alert("値のどれかが未入力です");
        return;
      }

      try {
        const response = await axios.put('/api/user', {
          id: userId,
          userName,
          userPrefecture,
          userBirthday,
          userGender,
        });

        const userInfo: UserInfo = {
          name: response.data.userName.S,
          prefecture: response.data.userPrefecture.S,
          birthdate: response.data.userBirthday.S,
          gender: response.data.userGender.S,
        }

        setUserInfo(userInfo);
        router.push("/");
      } catch (error) {
        console.error("Error:", error);
      }
    },
    [
      userName,
      userPrefecture,
      userBirthday,
      userGender,
      userId,
      setUserInfo,
      router,
    ]
  );

  return (
    <div className="flex h-full text-black text-center">
      <div className="bg-stone-300 rounded-xl opacity-90 w-[500px] h-fit m-auto pt-5 flex flex-col items-center">
        <h2 className="text-2xl">新規登録</h2>
        <form onSubmit={handleSubmit} className="w-[80%] my-5">
          <div className="mb-5">
            <label htmlFor="">名前：</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="rounded-md p-2 w-full text-white"
            />
          </div>

          <div className="flex flex-col mb-5">
            <label>都道府県：</label>
            <select
              className="text-white rounded-md p-2 mb-5"
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
              className="text-white rounded-md p-2 mb-5"
              value={userBirthday}
              onChange={(e) => setUserBirthday(String(e.target.value))}
            />

            <label htmlFor="">性別：</label>
            <select
              name=""
              id=""
              value={userGender}
              className="text-white rounded-md p-2 mb-5"
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
