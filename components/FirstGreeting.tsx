import Image from "next/image"
import { PropsWithChildren, useContext, useState, useCallback } from "react";
import { ViewerContext } from "../features/vrmViewer/viewerContext";
import * as Sentry from "@sentry/nextjs";
import { useFirstConversation } from "../hooks/useFirstConversation";

export const FirstGreeting: React.FC<PropsWithChildren> = ({ children }) => {
  const { viewer } = useContext(ViewerContext);

  // 始まりのボタンを押したかどうかの状態管理
  const [startButtonClicked, setStartButtonClicked] = useState<boolean>(false);
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
        setStartButtonClicked(true);
        // Characterの挨拶
        await speak();
        setFirstGreetingDone(true);
      } catch (error) {
        Sentry.captureException(error);
      }
    }
  }, [firstGreetingDone, speak, viewer.model]);

  const handleSkipFirstGreeting = useCallback(() => {
    viewer.model?.stopSpeak();
    setFirstGreetingDone(true);
    stopSpeaking();
  }, [stopSpeaking, viewer.model]);

  // if (!viewer.model) {
  //   return <></>;
  // }

  if (!firstGreetingDone) {
    return (
      <>
        <div className="absolute top-[31px] left-[24px] z-10">
          <Image src="/AILLA_logo_c.png" alt="AILLA Logo" width={140} height={25} />
        </div>
        <div
          className={`
          fixed flex flex-col justify-center items-center h-screen w-full bg-opacity-60
          ${startButtonClicked ? "bg-transparent" : "bg-black"}
          bg-[url('/background/login_background.png')]
          `}
        >
          <h4 className="text-[#47556D] text-[20px] font-semibold my-[20px] text-center">
            AILLAと<br />
            英会話を始めましょう！
          </h4>
          <div
            className="w-[160px] h-[160px] bg-gradient-46.5 rounded-full border border-solid border-white-80 flex items-center justify-center"
            onClick={greet} >
            <p className="text-base font-light 
              tracking-[4px]
              leading-6 tracking-wider 
              text-white text-center 
              text-[20px] font-[200px]
              ">
              START
            </p>
          </div>
          <div className="p-10">
            {startButtonClicked ? (
              currentText && (
                <p className="whitespace-pre-wrap text-white text-center text-xs font-bold bg-black bg-opacity-60 p-3 rounded">
                  {currentText}
                </p>
              )
            ) : (
                <div className="
              border border-opacity-20
              shadow-[0px_4px_16px_0px_rgba(0,0,0,0.15)]
              flex justify-center items-center
              border-white w-[342px] h-[116px]
              absolute top-[554px] left-[24px] rounded-[24px]">
                <p className="text-white text-center text-xs font-bold text-[#7B8392] text-[14px] font-weight-200">
                  マナーモード設定してる場合は
                  <br />
                  音声が発音されません
                </p>
              </div>
            )}
          </div>             
        </div>
      </>
    );
  }

  return <>{children}</>;
};
