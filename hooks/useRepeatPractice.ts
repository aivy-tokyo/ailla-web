import { useCallback, useEffect, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import {
  chatLogAtom,
  clientInfoAtom,
  isCharactorSpeakingAtom,
} from "../utils/atoms";

import { FirstConversation, RepeatPractice } from "@/utils/types";

import { Message } from "../features/messages/messages";
import { useViewer } from "./useViewer";
import { useCharactorSpeaking } from "./useCharactorSpeaking";

const situationFileNames = [
  // public/repeat_practice フォルダ内のファイル名を指定"
  "checkIn1.json",
  "checkIn2.json",
  "checkIn3.json",
  "checkout1.json",
  "checkout2.json",
];

export const useRepeatPractice = () => {
  const viewer = useViewer();
  const { speakCharactor } = useCharactorSpeaking();
  const setChatLog = useSetAtom(chatLogAtom);
  const clientInfo = useAtomValue(clientInfoAtom);

  const [roleOfAi, setRoleOfAi] = useState<string>("");
  const [roleOfUser, setRoleOfUser] = useState<string>("");

  const [firstGreetingDone, setFirstGreetingDone] = useState<boolean>(false);
  const [firstConversation, setFirstConversation] = useState<FirstConversation>();
  const [repeatPractice, setRepeatPractice] = useState<RepeatPractice | null>();
  const [repeatPracticeList, setRepeatPracticeList] = useState<RepeatPractice[]>([]);
  const [currentStep, setCurrentStep] = useState<string | null>();
  // NOTE: 内部処理用と表示用のstepを混ぜるとコードの可読性が落ちるため別々にしました
  // 内部処理用の step
  const [steps, setSteps] = useState<string[]>([]);
  // 表示用の step
  const [displaySteps, setDisplaySteps] = useState<string[]>([]);
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

  const lowercaseString = (arr: string[]) => arr.map(str => str.replace(/[,.?\d]/g, '').toLowerCase())

  const startRepeatPractice = useCallback(async (selectedRepeatPractice: RepeatPractice) => {
    if (!viewer.model) return;
    console.log("selectedRepeatPractice:",selectedRepeatPractice);

    setRepeatPractice(selectedRepeatPractice);
    setRoleOfAi(selectedRepeatPractice.roleOfAi);
    setRoleOfUser(selectedRepeatPractice.roleOfUser);
    setFirstConversation(selectedRepeatPractice.firstConversation)

    if (!firstGreetingDone) {
      await speakCharactor({
        text: await selectedRepeatPractice?.firstConversation?.descriptionEn,
        viewerModel: viewer.model,
        language,
      });
      setFirstGreetingDone(true);
    }

    setChatLog((prev) => [...prev, {
      role: "assistant",
      content: selectedRepeatPractice.steps[0],
    }]);
    setSteps(lowercaseString(selectedRepeatPractice.steps));
    setDisplaySteps(selectedRepeatPractice.steps)
    setCurrentStep(selectedRepeatPractice.steps[0].replace(/[,.?\d]/g, '').toLowerCase());

    await speakCharactor({
      text: selectedRepeatPractice.steps[0],
      viewerModel: viewer.model,
      language,
    });
  }, [
    setChatLog,
    viewer.model,
    language,
    firstGreetingDone,
    speakCharactor
  ])

  const sendMessage = useCallback(async (message: string) => {
      if (!viewer.model || !repeatPractice || !message.trim() || !steps) return;

    try {
      setIsCharactorSpeaking(true);
      const userMessage: Message = {
        role: "user",
        content: message,
      };
      setChatLog((prev) => [...prev, userMessage]);

      if (message.toLowerCase() !== currentStep) {
        const currentStepIndex = steps.findIndex(step => step === currentStep) 
        setChatLog((prev) => [...prev, {
          role: "assistant",
          content: `Repeat again ${displaySteps[currentStepIndex]}`,
        }]);

        await speakCharactor({
          text: `Repeat again ${currentStep}`,
          viewerModel: viewer.model,
          language,
        });

        return;
      }

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
        content: displaySteps[nextStepIndex],
      }]);

      await speakCharactor({
        text: displaySteps[nextStepIndex],
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
    displaySteps,
    viewer.model,
    speakCharactor,
    setChatLog,
    setIsCharactorSpeaking,
  ]);

  const stopSpeaking = useCallback(() => {
    setFirstGreetingDone(true);
    viewer.model?.stopSpeak();
  }, [viewer.model]);

  return {
    repeatPractice,
    repeatPracticeList,
    roleOfAi,
    roleOfUser,
    firstGreetingDone,
    firstConversation,
    isRepeatPracticeEnded,
    startRepeatPractice,
    sendMessage,
    stopSpeaking,
  }
};
