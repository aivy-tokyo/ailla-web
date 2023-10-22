import { useCallback, useEffect, useState } from "react";
import { ChatCompletionRequestMessage } from "openai";
import { useAtomValue, useSetAtom } from "jotai";
import {
  chatLogAtom,
  clientInfoAtom,
  isCharactorSpeakingAtom,
} from "../utils/atoms";

import { RepeatPractice, RepeatPracticeStep } from "@/utils/types";

import { Message } from "../features/messages/messages";
import { useViewer } from "./useViewer";
import { useCharactorSpeaking } from "./useCharactorSpeaking";

const situationFileNames = [
  // public/repeat_practice フォルダ内のファイル名を指定"
  "checkIn1.json",
];

export const useRepeatPractice = () => {
  const viewer = useViewer();
  const { speakCharactor } = useCharactorSpeaking();
  const setChatLog = useSetAtom(chatLogAtom);
  const clientInfo = useAtomValue(clientInfoAtom);

  const [roleOfAi, setRoleOfAi] = useState<string>("");
  const [roleOfUser, setRoleOfUser] = useState<string>("");

  const [repeatPractice, setRepeatPractice] = useState<RepeatPractice | null>();
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);
  const [repeatPracticeList, setRepeatPracticeList] = useState<RepeatPractice[]>([]);
  const [currentStep, setCurrentStep] = useState<RepeatPracticeStep | null>();
  const [steps, setSteps] = useState<RepeatPracticeStep[] | null>();
  const [isRepeatPracticeEnded, setIsRepeatPracticeEnded] =
    useState<boolean>(false);

  const language = clientInfo?.language ?? "";

  const setIsCharactorSpeaking = useSetAtom(isCharactorSpeakingAtom);

  useEffect(() => {
    Promise.all(
      situationFileNames.map((fileName) =>
        fetch(`repeat_practice/${fileName}`).then((res) => res.json())
      )
    ).then((dataArray) => setRepeatPracticeList(dataArray));
  }, []);

  const startRepeatPractice = useCallback(async (selectedRepeatPractice: RepeatPractice) => {
    if (!viewer.model) return;
    console.log("selectedRepeatPractice:",selectedRepeatPractice);

    setRepeatPractice(selectedRepeatPractice);
    setMessages([]);
    setRoleOfAi(selectedRepeatPractice.roleOfAi);
    setRoleOfUser(selectedRepeatPractice.roleOfUser);

    setChatLog((prev) => [...prev, {
      role: "assistant",
      content: selectedRepeatPractice.steps[0].sentence,
    }]);
    setSteps(selectedRepeatPractice.steps);
    setCurrentStep(selectedRepeatPractice.steps[0]);

    await speakCharactor({
      text: selectedRepeatPractice.steps[0].sentence,
      viewerModel: viewer.model,
      language,
    });
  }, [setChatLog, viewer.model, language, speakCharactor])

  const sendMessage = useCallback(async (message: string) => {
      if (!viewer.model || !repeatPractice || !message.trim() || !steps) return;

    try {
      setIsCharactorSpeaking(true);
      const userMessage: Message = {
        role: "user",
        content: message,
      };
      setChatLog((prev) => [...prev, userMessage]);

      const nextStepIndex = steps.findIndex(step => step === currentStep) != -1
        ? steps.findIndex(step => step === currentStep) + 1
        : -1;
      const isLastIndex = nextStepIndex === steps.length;

      // 次のstepが見つからない場合、リピートプラクティスを終了させる
      if (isLastIndex) {
        setChatLog((prev) => [...prev, {
          role: "assistant",
          content: "お疲れ様でした。リピートプラクティスを終了します。",
        }]);

        await speakCharactor({
          text: "お疲れ様でした。リピートプラクティスを終了します。",
          viewerModel: viewer.model,
          language: "ja",
        });

        setIsRepeatPracticeEnded(true);
        return;
      }

      setCurrentStep(steps[nextStepIndex]);
      setChatLog((prev) => [...prev, {
        role: "assistant",
        content: steps[nextStepIndex].sentence,
      }]);

      await speakCharactor({
        text: steps[nextStepIndex].sentence,
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
    language,
    repeatPractice,
    currentStep,
    steps,
    viewer.model,
    speakCharactor,
    setChatLog,
    setIsCharactorSpeaking,
  ]);

  return {
    repeatPractice,
    repeatPracticeList,
    roleOfAi,
    roleOfUser,
    startRepeatPractice,
    sendMessage,
    isRepeatPracticeEnded,
  }
};
