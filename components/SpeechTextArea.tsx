import React from "react";

interface ChatLog {
  role: string;
  content: string;
}

interface SpeechTextAreaProps {
  chatLogs: ChatLog[];
  roleOfAi?: string;
  roleOfUser?: string;
}

export const SpeechTextArea: React.FC<SpeechTextAreaProps> = ({
  chatLogs,
  roleOfAi,
  roleOfUser,
}) => {
  return (
    <>
      {chatLogs.map((chatLog, id) => (
        <div key={id} className="flex flex-col">
          <div
            className={`chat mb-3 flex flex-col text-white max-w-[900px] ${
              chatLog.role === "user" ? "chat-end justify-end" : "chat-start"
            }`}
          >
            {chatLog.role === "user" ? (
              <p className="self-end font-bold">{roleOfUser || 'You'}</p>
            ) : (
              <p className="font-bold">{roleOfAi || 'AILLA'}</p>
            )}
            {/* chat-bubbleだった 部分*/}
            <p
              className={`${
                chatLog.role === "user"
                ? "rounded-[1rem] rounded-br-[0rem] bg-gradient-pink text-white font-chinese font-family-source-han-sans"
                : "rounded-[1rem] rounded-bl-[0rem] bg-white text-[#47556D] font-chinese font-family-source-han-sans"
              } z-40 max-w-[80vw] min-w-[30vw] p-[1rem] w-fit`}
            >
              {chatLog.content}
            </p>
          </div>
        </div>
      ))}
    </>
  );
};
