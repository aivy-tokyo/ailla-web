import axios from "axios";
import { useAtom } from "jotai";
import { useState, useCallback, useEffect } from "react";
import { userInfoAtom } from "../utils/atoms";

export const useUserInfo = () => {
  const [userInfo, setUserInfo] = useAtom(userInfoAtom);
  const [isUserInfoLoading, setIsUserInfoLoading] = useState(true);
  const [isUserInfoError, setIsUserInfoError] = useState(false);

  const fetchUserInfo = useCallback(async () => {
    setIsUserInfoLoading(true);
    setIsUserInfoError(false);
    try {
      const res = await axios.get("/api/user");
      setUserInfo(res.data);
    } catch (err) {
      setIsUserInfoError(true);
    }
    setIsUserInfoLoading(false);
  }
  , []);

  useEffect(() => {
    fetchUserInfo();
  }
  , [fetchUserInfo]);

  return { userInfo, isUserInfoLoading, isUserInfoError, fetchUserInfo };
};