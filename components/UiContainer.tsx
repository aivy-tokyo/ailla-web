import { useContext, useCallback, useEffect, useState } from "react";
import { HeaderUi } from "./HeaderUi";
import { useRouter } from "next/router";
import { ViewerContext } from "../features/vrmViewer/viewerContext";
import { useAtomValue, useSetAtom } from "jotai";
import { chatLogAtom, isVoiceInputAllowedAtom } from "../utils/atoms";
import { useVoiceInput } from "../hooks/useVoiceInput";
import * as Sentry from "@sentry/nextjs";
import { useFirstConversation } from "../hooks/useFirstConversation";

export const UiContainer = () => {
  const router = useRouter();
  const { viewer } = useContext(ViewerContext);
  const isVoiceInputAllowed = useAtomValue(isVoiceInputAllowedAtom);
  const setChatLog = useSetAtom(chatLogAtom);
  // 最初の挨拶をしたかどうかの状態管理
  const [firstGreetingDone, setFirstGreetingDone] = useState<boolean>(false);
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
  }, [firstGreetingDone, speak, viewer.model]);

  useEffect(() => {
    greet();
  }, []);
  const handleSkipFirstGreeting = useCallback(() => {
    viewer.model?.stopSpeak();
    setFirstGreetingDone(true);
    stopSpeaking();
  }, [stopSpeaking, viewer.model]);

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

  return (
    <>
      <HeaderUi />
      {firstGreetingDone ? (
        <div className="flex justify-center">
          <div className="fixed bottom-0 flex flex-col items-center gap-2 p-2">
            <button
              className="bg-white bg-opacity-80 h-[4rem] w-[24rem] text-xs rounded-[7.1rem]"
              onClick={() => router.push("/?mode=free-talk")}
            >
              フリートーク
            </button>
            <button
              className="bg-white bg-opacity-80 h-[4rem] w-[24rem] text-xs rounded-[7.1rem]"
              onClick={() => router.push("/?mode=situation")}
            >
              シチュエーショントーク
            </button>
            <button
              className="bg-white bg-opacity-80 h-[4rem] w-[24rem] text-xs rounded-[7.1rem]"
              onClick={() => {
                // @ts-ignore
                modal_comming_soon.showModal();
              }}
            >
              リピートプラクティス
            </button>
          </div>
        </div>
      ) : (
        <div>
          {currentText && (
            <p className="whitespace-pre-wrap text-white text-center text-xs font-bold bg-black bg-opacity-60 p-3 rounded">
              {currentText}
            </p>
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
      <dialog id="modal_help" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">使い方</h3>
          <p className="py-4">
            このアプリでは、Aillaと英語で会話をすることができます。
            <br />
            英会話の練習には3つのモードがあります。
            <br />
            <br />
            <strong>1. フリートークモード</strong>
            <br />
            <strong>2. シチュエーションモード</strong>
            <br />
            <strong>3. リピートプラクティスモード</strong>
            <br />
            <br />
            <strong>フリートークモード</strong>
            では、自由に会話をすることができます。
            <br />
            <strong>シチュエーションモード</strong>
            では、シチュエーションに沿った会話をすることができます。
            <br />
            <strong>リピートプラクティスモード</strong>
            では、Aillaが英語を話すので、それを聞いてリピートすることで発音の練習をすることができます。
            <br />
            <br />
            モードを選択すると、会話が始まります。
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
