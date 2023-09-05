import React from 'react';

interface ChatLog {
  role: string;
  content: string;

}

interface SpeechTextAreaProps {
  chatLogs: ChatLog[];
  roleOfAi?: string;
  roleOfUser?: string;
}

export const SpeechTextArea: React.FC<SpeechTextAreaProps> = ({ chatLogs,roleOfAi, roleOfUser }) => {
  return (
    <>
      {chatLogs.map((chatLog, id) => (
        <div key={id} className='flex flex-col'>
          { 
            roleOfAi && roleOfUser && (
              chatLog.role === "user" ?
              <p className='self-end'>{roleOfUser}</p>
              :
              <p>{roleOfAi}</p>
            )
          }
          <div className={`chat mb-3 flex text-white max-w-[900px] ${chatLog.role === 'user' ? 'chat-end justify-end' : 'chat-start'}`}>
            <p className={`${chatLog.role === 'user' ? 'chat-bubble bg-gray-100 text-gray-600' : 'chat-bubble bg-gray-800 text-white'} max-w-[80vw] w-fit`}>
              {chatLog.content}
            </p>
          </div>
        </div>
      ))}
    </>
  );
};