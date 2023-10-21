import { UserInfo } from "@/entities/UserInfo";
import { userIdAtom, userInfoAtom } from "@/utils/atoms";
import { Prefecture, UserGenderType } from "@/utils/types";
import axios from "axios";
import { useAtom, useAtomValue } from "jotai";
import { signOut } from "next-auth/react";
import { useCallback } from "react";

export const useUserInfo = () => {
  const userId = useAtomValue(userIdAtom);
  const [userInfo, setUserInfo] = useAtom(userInfoAtom);

  const registerUserInfo = useCallback(
    async (
      userName: string,
      userPrefecture: Prefecture,
      userBirthdate: string,
      userGender: UserGenderType
    ) => {
      console.log(
        "registerUserInfo",
        userName,
        userPrefecture,
        userBirthdate,
        userGender
      );
      const response = await axios.put("/api/user", {
        id: userId,
        name: userName,
        prefecture: userPrefecture,
        birthdate: userBirthdate,
        gender: userGender,
      });

      const userInfo: UserInfo = {
        name: response.data.name.S,
        prefecture: response.data.prefecture.S,
        birthdate: response.data.birthdate.S,
        gender: response.data.gender.S,
      };

      setUserInfo(userInfo);
    },
    [userId, setUserInfo]
  );

  const editUserInfo = useCallback(
    async (
      userName: string,
      userPrefecture: Prefecture,
      userBirthdate: string,
      userGender: UserGenderType
    ) => {
      if (!userId) return;

      console.log(
        "editUserInfo",
        userName,
        userPrefecture,
        userBirthdate,
        userGender
      );

      const response = await axios.post("/api/user", {
        id: userId,
        name: userName,
        prefecture: userPrefecture,
        birthdate: userBirthdate,
        gender: userGender,
      });

      const userInfo: UserInfo = {
        name: response.data.name.S,
        prefecture: response.data.prefecture.S,
        birthdate: response.data.birthdate.S,
        gender: response.data.gender.S,
      };
      setUserInfo(userInfo);
    },
    [userId, setUserInfo]
  );

  const deleteUserInfo = useCallback(async () => {
    try {
      await axios(`/api/user`, {
        method: "DELETE",
        data: {
          id: userId,
        },
      });
      setUserInfo(null);
      await signOut();
    } catch (error) {
      console.error("Error:", error);
    }
  }, [userId, setUserInfo]);

  return {
    userId,
    registerUserInfo,
    editUserInfo,
    deleteUserInfo,
    userInfo,
    setUserInfo,
  };
};
