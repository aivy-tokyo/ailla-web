import { UserInfo } from "@/entities/UserInfo";
import { userIdAtom, userInfoAtom } from "@/utils/atoms";
import { Prefecture, UserGenderType } from "@/utils/types";
import axios from "axios";
import { useAtom, useAtomValue } from "jotai";
import { useState } from "react";

export const useProfile = () => {
  const userId = useAtomValue(userIdAtom);
  const [isEditMode,setIsEditMode] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useAtom(userInfoAtom);
  
const editProfile = (userName: string, userPrefecture: Prefecture, userBirthdate: string, userGender: UserGenderType) => {
  if (!userId) return;

  axios.post(`/api/user`, {
    id: userId,
    name: userName,
    prefecture: userPrefecture,
    birthdate: userBirthdate,
    gender: userGender,
  }, {
    headers: {
      'Content-Type': 'application/json',
    }
  })
  .then(response => {
    const userInfo: UserInfo = {
      name: response.data.name.S,
      prefecture: response.data.prefecture.S,
      birthdate: response.data.birthdate.S,
      gender: response.data.gender.S
    };
    setIsEditMode(false);
    setUserInfo(userInfo);
  })
  .catch(error => {
    console.error('Error:', error);
  });
};

  return {
    userId,
    editProfile,

    userInfo, setUserInfo,
    isEditMode, setIsEditMode
  };
};