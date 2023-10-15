import { useAtomValue, useSetAtom } from "jotai";
import {
  chatLogAtom,
  clientInfoAtom,
  isCharactorSpeakingAtom,
} from "../utils/atoms";
import { ChatCompletionRequestMessage } from "openai";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Message } from "../features/messages/messages";
import { useViewer } from "./useViewer";
import { Situation } from "@/utils/types";
import { useCharactorSpeaking } from "./useCharactorSpeaking";

export const useSituationTalk = () => {
  const viewer = useViewer();
  const { speakCharactor } = useCharactorSpeaking();
  const setChatLog = useSetAtom(chatLogAtom);
  const clientInfo = useAtomValue(clientInfoAtom);
  const [roleOfAi, setRoleOfAi] = useState<string>("");
  const [roleOfUser, setRoleOfUser] = useState<string>("");

  const language = clientInfo?.language ?? "";
  const clientSituationList = clientInfo?.situationList ?? [];

  const setIsCharactorSpeaking = useSetAtom(isCharactorSpeakingAtom);

  const [situation, setSituation] = useState<Situation | null>();
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);
  const [situationList, setSituationList] = useState<Situation[]>([]);
  const [stepStatus, setStepStatus] = useState<
    Array<Situation["steps"][number] & { isClear: boolean }>
  >([]);
  useEffect(
    () =>
      setStepStatus(
        situation?.steps.map((step) => ({ ...step, isClear: false })) ?? []
      ),
    [situation]
  );

  useEffect(() => {
    Promise.all(
      clientSituationList.map((fileName) =>
        fetch(`situation_data/${language}/${fileName}.json`).then((res) =>
          res.json()
        )
      )
    ).then((dataArray) => setSituationList(dataArray));
  }, []);

  const startSituationTalk = useCallback(
    async (selectedSituation: Situation) => {
      if (!viewer.model) return;

      try {
        // シチュエーション会話スタート: シチュエーション設定、次のステップ設定
        setSituation(selectedSituation);
        setMessages([]);
        setRoleOfAi(selectedSituation.roleOfAi);
        setRoleOfUser(selectedSituation.roleOfUser);

        // 最初のメッセージリクエスト
        const response = await axios.post("/api/chat/situation", {
          title: selectedSituation.title,
          description: selectedSituation.description,
          messages: [],
          role: selectedSituation.roleOfAi,
          speakLanguage: clientInfo?.speakLanguage,
        });
        console.log("response->", response);
        const { messages: newMessages } = response.data;
        console.log("newMessages->", newMessages);
        setMessages(newMessages);
        setChatLog((prev) => [...prev, newMessages[newMessages.length - 1]]);

        // キャラクター発話
        await speakCharactor({
          text: newMessages[newMessages.length - 1].content,
          viewerModel: viewer.model,
          language,
        });
      } catch (error) {
        console.error(error);
      }
    },
    [setChatLog, speakCharactor, viewer.model]
  );

  const sendMessage = useCallback(
    async (message: string) => {
      if (!viewer.model || !situation || !message.trim()) return;

      try {
        setIsCharactorSpeaking(true);

        // TODO 各stepのkeySentencesを確認して、クリアしたstepを記録する
        // Userメッセージを送信
        const userMessage: Message = {
          role: "user",
          content: message,
        };
        console.log("userMessage->", userMessage);
        setChatLog((prev) => [...prev, userMessage]);

        console.log("clientInfo?.language->", clientInfo?.language);

        const response = await axios.post("/api/chat/situation", {
          title: situation.title,
          description: situation.description,
          messages: [...messages, userMessage],
          role: roleOfAi,
          language: clientInfo?.language,
        });
        console.log("response->", response);
        const { messages: newMessages } = response.data;
        console.log("newMessages->", newMessages);
        setMessages(newMessages);
        setChatLog((prev) => [...prev, newMessages[newMessages.length - 1]]);

        // キャラクターの発話
        await speakCharactor({
          text: newMessages[newMessages.length - 1].content,
          viewerModel: viewer.model,
          language,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setIsCharactorSpeaking(false);
      }
    },
    [
      viewer.model,
      situation,
      setIsCharactorSpeaking,
      setChatLog,
      messages,
      roleOfAi,
      speakCharactor,
    ]
  );

  return {
    situation,
    stepStatus,
    situationList,
    messages,
    startSituation: startSituationTalk,
    sendMessage,
    roleOfAi,
    roleOfUser,
  };
};
