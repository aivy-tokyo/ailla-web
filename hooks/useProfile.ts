import { userIdAtom, userInfoAtom } from "@/utils/atoms";
import { Prefecture, UserGenderType, UserProfile } from "@/utils/types";
import axios from "axios";
import { useAtomValue, useSetAtom } from "jotai";
import { userInfo } from "os";
import { use, useEffect, useState } from "react";

export const useProfile = () => {
  const [userName, setUserName] = useState<string>('');
  const [userPrefecture, setUserPrefecture] = useState<Prefecture>('選択しない');
  const [userBirthday, setUserBirthday] = useState<string>('');
  const [userGender, setUserGender] = useState<UserGenderType>('選択しない');
  const userId = useAtomValue(userIdAtom);
  const [isEditMode,setIsEditMode] = useState<boolean>(false);

  // TODO: ユーザー情報周りをリファクタリングしたら、ここは消す
  const setUserInfo = useSetAtom(userInfoAtom);
  useEffect(()=>{
    setUserInfo({
      name: userName,
      prefecture: userPrefecture,
      birthdate: userBirthday,
      gender: userGender
    });
  },[userName, userPrefecture, userBirthday, userGender, setUserInfo]);
  
  const fetchUserInfo = async () => {
    if(!userId)return;
    const res = await axios.get(`/api/user?id=${userId}`)
    
    const userProfile : UserProfile = await res.data;
    
    setUserName(userProfile.userName.S);
    setUserPrefecture(userProfile.userPrefecture.S);
    setUserBirthday(userProfile.userBirthday.S);
    setUserGender(userProfile.userGender.S);
  };
  
  useEffect(()=>{
    fetchUserInfo();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[isEditMode,userId]);
  
const editProfile = () => {
  if (!userId) return;

  axios.post(`/api/user?id`, {
    id: userId,
    userName: userName,
    userPrefecture: userPrefecture,
    userBirthday: userBirthday,
    userGender: userGender,
  }, {
    headers: {
      'Content-Type': 'application/json',
    }
  })
  .then(response => {
    const data: UserProfile = response.data;
    setIsEditMode(false);
    setUserName(data.userName.S);
    setUserPrefecture(data.userPrefecture.S);
    setUserBirthday(data.userBirthday.S);
    setUserGender(data.userGender.S);
  })
  .catch(error => {
    console.error('Error:', error);
  });
};


  return {
    fetchUserInfo,
    userId,
    editProfile,

    userName,       setUserName,
    userPrefecture, setUserPrefecture,
    userBirthday,   setUserBirthday,
    userGender,     setUserGender,

    isEditMode, setIsEditMode
  };
};