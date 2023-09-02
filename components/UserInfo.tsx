import { FaRegUserCircle } from "react-icons/fa";
import { Prefecture, UserGenderType } from "@/utils/types";
import { prefectures } from "@/utils/constants";
import { useUserInfo } from "@/hooks/useUserInfo";
import { useCallback, useState } from "react";
import { HeaderLabel } from "./HeaderLabel";

const UserInfo = () => {
  const { editUserInfo, deleteUserInfo, userInfo, isEditMode, setIsEditMode } =
    useUserInfo();
  const [name, setName] = useState<string>(userInfo?.name as string);
  const [prefecture, setPrefecture] = useState<Prefecture>(
    userInfo?.prefecture as Prefecture
  );
  const [birthdate, setBirthdate] = useState<string>(
    userInfo?.birthdate as string
  );
  const [gender, setGender] = useState<UserGenderType>(
    userInfo?.gender as UserGenderType
  );

  const handleSubmit = (e: any) => {
    e.preventDefault();
    editUserInfo(name, prefecture, birthdate, gender);
  };

  const handleUserDelete = useCallback(() => {
    const ok = confirm("ユーザーを削除しますか？");
    if (ok) {
      deleteUserInfo();
    }
  }, [deleteUserInfo]);

  return (
    <div className="w-full">
      {isEditMode ? (
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between items-center mb-5">
            <button className="btn btn-neutral btn-sm" onClick={() => setIsEditMode(false)}>
              キャンセル
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              更新する
            </button>
          </div>
          <div className="flex flex-col mb-5">
            <label htmlFor="name">
              <HeaderLabel>名前：</HeaderLabel>
            </label>
            <input
              id="name"
              type="text"
              className="input"
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
            <input
              id="birthdate"
              type="text"
              className="input"
              pattern="\d{4}/\d{2}/\d{2}"
              title="yyyy/mm/ddの形式で入力してください"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
            />
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
            <button className="btn btn-error btn-xs w-full" onClick={handleUserDelete}>
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
