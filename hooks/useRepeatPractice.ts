import { useSetAtom } from "jotai";
import {
  chatLogAtom,
  isCharactorSpeakingAtom,
} from "../utils/atoms";
import { ChatCompletionRequestMessage } from "openai";
import axios from "axios";

import { RepeatPractice } from "@/utils/types";
import { useCallback, useEffect, useState } from "react";

const situationFileNames = [
  // public/repeat_practice フォルダ内のファイル名を指定"
  "checkIn1.json",
];

export const useRepeatPractice = () => {
  const [roleOfAi, setRoleOfAi] = useState<string>("");
  const [roleOfUser, setRoleOfUser] = useState<string>("");

  const [repeatPractice, setRepeatPractice] = useState<RepeatPractice | null>();
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);
  const [repeatPracticeList, setRepeatPracticeList] = useState<RepeatPractice[]>([]);

  const setIsCharactorSpeaking = useSetAtom(isCharactorSpeakingAtom);

  useEffect(() => {
    Promise.all(
      situationFileNames.map((fileName) =>
        fetch(`repeat_practice/${fileName}`).then((res) => res.json())
      )
    ).then((dataArray) => setRepeatPracticeList(dataArray));
  }, []);

  const startRepeatPractice = useCallback(async (selectedRepeatPractice: RepeatPractice) => {
    setRepeatPractice(selectedRepeatPractice);
    setMessages([]);
    setRoleOfAi(selectedRepeatPractice.roleOfAi);
    setRoleOfUser(selectedRepeatPractice.roleOfUser);

    const response = await axios.post("/api/chat/repeat-practice", {
      title: selectedRepeatPractice.title,
      description: selectedRepeatPractice.description,
      messages: [],
      role: selectedRepeatPractice.roleOfAi,
    });
    console.log("response->", response);
    const { messages: newMessages } = response.data;
    console.log("newMessages->", newMessages);
    setMessages(newMessages);
  }, [])

  return {
    repeatPractice,
    repeatPracticeList,
    roleOfAi,
    roleOfUser,
    startRepeatPractice,
  }
};