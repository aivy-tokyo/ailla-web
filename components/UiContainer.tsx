import { useContext, useCallback, useEffect, useState } from "react";
import { HeaderUi } from "./HeaderUi";
import { useRouter } from "next/router";
import { ViewerContext } from "../features/vrmViewer/viewerContext";
import { useAtomValue, useSetAtom } from "jotai";
import { chatLogAtom, isVoiceInputAllowedAtom } from "../utils/atoms";
import { useVoiceInput } from "../hooks/useVoiceInput";
import * as Sentry from "@sentry/nextjs";
import { useFirstConversation } from "../hooks/useFirstConversation";
import { FirstGreetingContext } from "@/features/firstGreetingContext";
import { ButtonTalkMode } from "./ButtonTalkMode";

export const UiContainer = () => {
  const router = useRouter();
  const { viewer } = useContext(ViewerContext);
  const isVoiceInputAllowed = useAtomValue(isVoiceInputAllowedAtom);
  const setChatLog = useSetAtom(chatLogAtom);
  // 最初の挨拶をしたかどうかの状態管理
  const { firstGreetingDone, setFirstGreetingDone } =
    useContext(FirstGreetingContext);
  // 話しているテキストの状態管理
  const [currentText, setCurrentText] = useState<string>("");
  // 最初の挨拶をする関数
  const { speak, stopSpeaking } = useFirstConversation({
    onSpeaking: useCallback((text: string) => setCurrentText(text), []),
    onSpeakingEnd: useCallback(() => setCurrentText(""), []),
  });

  const greet = useCallback(async () => {
    if (viewer.model && !firstGreetingDone) {
      try {
        await viewer.model.resumeAudio(); //MEMO:iOSだとAudioContextのstateが'suspended'になり、音声が再生できないことへの対策。
        // Characterの挨拶
        await speak();
        setFirstGreetingDone(true);
      } catch (error) {
        Sentry.captureException(error);
      }
    }
  }, [firstGreetingDone, setFirstGreetingDone, speak, viewer.model]);

  useEffect(() => {
    if (!firstGreetingDone) greet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstGreetingDone]);

  const handleSkipFirstGreeting = useCallback(() => {
    viewer.model?.stopSpeak();
    setFirstGreetingDone(true);
    stopSpeaking();
  }, [stopSpeaking, setFirstGreetingDone, viewer.model]);

  useEffect(() => {
    viewer.model?.stopSpeak();
    setChatLog([]);
  }, [setChatLog, viewer.model]);

  const { getUserMediaPermission } = useVoiceInput({});
  useEffect(() => {
    if (!isVoiceInputAllowed) {
      getUserMediaPermission();
    }
  }, [getUserMediaPermission, isVoiceInputAllowed]);

  const Buttons = () => {
    return [
      {
        title: "フリートーク",
        englishTitle: "Free talk",
        onClick: () => router.push("/?mode=free-talk"),
      },
      {
        title: "シチュエーション",
        englishTitle: "Situation talk",
        onClick: () => router.push("/?mode=situation"),
      },

      {
        title: "リピートプラクティス",
        englishTitle: "Repeat practice",
        // @ts-ignore
        onClick: () => modal_comming_soon.showModal(),
      },
    ].map((item, index) => {
      return <ButtonTalkMode item={item} key={index} />;
    });
  };

  return (
    <>
      {firstGreetingDone ? (
        <>
          <HeaderUi />
          <div className="flex justify-center">
            <div className="fixed bottom-[2rem] flex flex-col items-center gap-4 p-2">
              <Buttons />
            </div>
          </div>
        </>
      ) : (
        <div>
          {currentText && (
            <div className="flex justify-center">
              <div className="fixed bottom-[11rem]">
                <div className="bg-white flex w-[24rem] text-center p-4 justify-center items-center padding-[1rem] gap-2.5 rounded-xl">
                  <p className="whitespace-pre-wrap text-black  text-[0.8rem] font-[30rem]  ">
                    {currentText}
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-center bg-white bg-opacity-20 w-[8rem] h-[2.3rem] rounded-[7rem] absolute left-1/2 transform -translate-x-1/2 bottom-[3rem]">
            <button
              className="text-[1rem]"
              onClick={() => handleSkipFirstGreeting()}
            >
              スキップする
            </button>
          </div>
        </div>
      )}
      {/* Open the modal using document.getElementById('ID').showModal() method */}
      <dialog id="modal_comming_soon" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Coming Soon</h3>
          <p className="py-4">
            この機能は現在準備中です。
            <br />
            しばらくお待ちください。
          </p>
          <div className="modal-action">
            <form method="dialog" className="flex justify-center w-full">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">とじる</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};
