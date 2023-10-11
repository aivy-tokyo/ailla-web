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
          <div className="relative w-45 h-45">
            <Image src="/start_sphere.svg" alt="start sphere" width={180} height={180} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white tracking-[.2em] text-[1.2rem] font-[200]">START</span>
            </div>
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
                 border border-opacity-20 border-white backdrop-blur
                 shadow-manner-mode flex flex-col
                 justify-center items-center w-[342px] h-[116px] absolute top-[554px] left-[24px] rounded-[24px]">
                <svg className="mb-2" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <g opacity="0.6">
                    <path d="M16 29.3334C8.63599 29.3334 2.66666 23.364 2.66666 16C2.66666 8.63602 8.63599 2.66669 16 2.66669C23.364 2.66669 29.3333 8.63602 29.3333 16C29.3333 23.364 23.364 29.3334 16 29.3334ZM16 26.6667C18.829 26.6667 21.5421 25.5429 23.5425 23.5425C25.5428 21.5421 26.6667 18.829 26.6667 16C26.6667 13.171 25.5428 10.4579 23.5425 8.45755C21.5421 6.45716 18.829 5.33335 16 5.33335C13.171 5.33335 10.4579 6.45716 8.45752 8.45755C6.45713 10.4579 5.33332 13.171 5.33332 16C5.33332 18.829 6.45713 21.5421 8.45752 23.5425C10.4579 25.5429 13.171 26.6667 16 26.6667ZM16 9.33335C16.3536 9.33335 16.6927 9.47383 16.9428 9.72388C17.1928 9.97393 17.3333 10.3131 17.3333 10.6667V17.3334C17.3333 17.687 17.1928 18.0261 16.9428 18.2762C16.6927 18.5262 16.3536 18.6667 16 18.6667C15.6464 18.6667 15.3072 18.5262 15.0572 18.2762C14.8071 18.0261 14.6667 17.687 14.6667 17.3334V10.6667C14.6667 10.3131 14.8071 9.97393 15.0572 9.72388C15.3072 9.47383 15.6464 9.33335 16 9.33335ZM16 22.6667C15.6464 22.6667 15.3072 22.5262 15.0572 22.2762C14.8071 22.0261 14.6667 21.687 14.6667 21.3334C14.6667 20.9797 14.8071 20.6406 15.0572 20.3905C15.3072 20.1405 15.6464 20 16 20C16.3536 20 16.6927 20.1405 16.9428 20.3905C17.1928 20.6406 17.3333 20.9797 17.3333 21.3334C17.3333 21.687 17.1928 22.0261 16.9428 22.2762C16.6927 22.5262 16.3536 22.6667 16 22.6667Z" fill="#47556D" />
                  </g>
                </svg>
                <p className="text-center font-normal font-bold text-[#7B8392] text-[14px] font-weight-200">
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
