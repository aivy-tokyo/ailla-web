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
            <p
              className={`${
                chatLog.role === "user"
                  ? "chat-bubble font-chinese bg-gray-100 text-gray-600 font-family-source-han-sans"
                  : "chat-bubble font-chinese bg-gray-800 text-white font-family-source-han-sans"
              } max-w-[80vw] w-fit`}
            >
              {chatLog.content}
            </p>
          </div>
        </div>
      ))}
    </>
  );
};
