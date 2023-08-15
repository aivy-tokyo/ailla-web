import { getChatResponseStream } from "@/features/chat/openAiChat";
import {
  Message,
  Screenplay,
} from "@/features/messages/messages";
import { ViewerContext } from "@/features/vrmViewer/viewerContext";

import {
  aiResponseTextAtom,
  assistantMessageAtom,
  chatLogAtom,
  chatProcessingAtom,
  commentIndexAtom,
  isAiTalkingAtom,
  isThinkingAtom,
  koeiroParamAtom,
  textToSpeechApiTypeAtom,
} from "@/utils/atoms";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useCallback, useContext, useState } from "react";
import {
  SYSTEM_PROMPT_FOR_ENGLISH_CONVERSATION,
} from "@/features/constants/systemPromptConstants";
import { speakEnglishCharacter } from "@/features/messages/speakEnglishCharacter";
import { TextToSpeechApiType } from "@/utils/types";


const exceededChatLimitMessages = [
  "In this demo, you can chat up to 10 times a day! Don't forget to come back and see me tomorrow, okay?",
  "Just so you know, we can only chat 10 times a day in this demo. But don't worry, we can continue our fun chat tomorrow! See you!",
  "Hey, just a heads up! We're limited to 10 chats a day in this demo. But I'll be waiting for you to come back tomorrow, promise!",
  "In this demo, our daily chat limit is 10. But that's okay, right? We can always continue our chat tomorrow. Can't wait to see you!",
  "Guess what? We can chat up to 10 times a day in this demo! But no worries, we can always chat more tomorrow. Looking forward to it!",
];
function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}
function checkChatLimit(chatDate: Date, chatCount: number): boolean {
  // Check if the chat date is the same as today's date
  if (isToday(chatDate)) {
    // If it's the same day, check the chat count
    if (chatCount >= 20) {
      return false;
    } else {
      return true;
    }
  } else {
    // If it's not the same day, return true (no limit exceeded)
    return true;
  }
}

export const useEnglishChat = () => {
  const { viewer } = useContext(ViewerContext);
  const setAssistantMessage = useSetAtom(assistantMessageAtom);
  const setChatProcessing = useSetAtom(chatProcessingAtom);
  const [chatLog, setChatLog] = useAtom(chatLogAtom);
  const koeiroParam = useAtomValue(koeiroParamAtom);
  const [commentIndex, setCommentIndex] = useAtom(commentIndexAtom);
  const setAiResponseText = useSetAtom(aiResponseTextAtom);
  const [openAiKey, setOpenAiKey] = useState(process.env.NEXT_PUBLIC_OPENAI_API_KEY);

  const [, setIsThinking] = useAtom(isThinkingAtom);
  const [isAiTalking, setIsAiTalking] = useAtom(isAiTalkingAtom);

  const textToSpeechApiType = useAtomValue(textToSpeechApiTypeAtom);

  const interjections = [
    "Let's see,",
    "Well,",
    "Hmm,",
    "Um,",
    "Well, you see,",
    "So, um,",
  ];

  // 間投詞をランダムに返す
  const getRandomInterjection = (): string => {
    const randomIndex = Math.floor(Math.random() * interjections.length);
    return interjections[randomIndex];
  };

  /**
   * 文ごとに音声を直列でリクエストしながら再生する
   */
  const handleSpeakAi = useCallback(
    async (
      screenplay: Screenplay,
      textToSpeechApiType: TextToSpeechApiType,
      onStart?: () => void,
      onEnd?: () => void,
    ): Promise<void> => {
      return speakEnglishCharacter(screenplay, viewer, textToSpeechApiType,onStart, onEnd);
    },
    [viewer]
  );

  /**
   * アシスタントとの会話を行う
   * ここで、ユーザーの発言をどのAPIに送るかを決める（PID占いAPI、普通のchatGPT）
   */
  const handleSendChat = useCallback(
    async (text: string) => {
      console.log('chatLog->',chatLog);
      if (!openAiKey) {
        console.error("APIキーが入力されていません");
        return;
      }

      // Check if the chat limit is exceeded
      // const lastChatDate = new Date(localStorage.getItem("lastChatDate") || "");

      // const chatCount = Number(localStorage.getItem("chatCount"));
      // if (!checkChatLimit(lastChatDate, chatCount)) {
      //   const randomIndex = Math.floor(
      //     Math.random() * exceededChatLimitMessages.length
      //   );
      //   const exceededChatLimitMessage = exceededChatLimitMessages[randomIndex];
      //   handleSpeakAi(
      //     {
      //       talk: {
      //         message: exceededChatLimitMessage,
      //         speakerX: 1,
      //         speakerY: 1,
      //         style: "talk",
      //       },
      //       expression: "neutral",
      //     },
      //     textToSpeechApiType,
      //     () => {
      //       setAssistantMessage(exceededChatLimitMessage);
      //     }
      //   );
      //   setChatLog((prev) => [
      //     ...prev,
      //     { role: "assistant", content: exceededChatLimitMessage },
      //   ]);
      //   return;
      // } else {
      //   // If the chat limit is not exceeded, update the chat count and chat date
      //   localStorage.setItem("chatCount", String(isToday(lastChatDate) ? chatCount + 1 : 1));
      //   localStorage.setItem("lastChatDate", String(new Date()));
      // }

      const newMessage = text;

      if (newMessage == null) return;

      setChatProcessing(true);

      // ユーザーの発言を追加して表示
      const messageLog: Message[] = [
        ...chatLog,
        { role: "user", content: newMessage },
      ];
      setChatLog(messageLog);

      // Chat GPTへ
      const messages: Message[] = [
        {
          role: "system",
          content: SYSTEM_PROMPT_FOR_ENGLISH_CONVERSATION,
        },
        ...messageLog,
      ];

      const stream = await getChatResponseStream(messages, openAiKey).catch(
        (e) => {
          console.error(e);
          return null;
        }
      );
      if (stream == null) {
        setChatProcessing(false);
        return;
      }

      const reader = stream.getReader();
      let receivedMessage = "";
      const speakPromises: Promise<any>[] = []; //各センテンスの発話のPromiseを格納する配列
      try {
        while (true) {
          const { done, value } = await reader.read();
          console.log("value", value);
          if (done) break;

          receivedMessage += value;
        }
        console.log("receivedMessage", receivedMessage);
        handleSpeakAi(
          {
            talk: {
              message: receivedMessage,
              speakerX: 1,
              speakerY: 1,
              style: "talk",
            },
            expression: "neutral",
          },
          textToSpeechApiType,
          () => {
            setAssistantMessage(receivedMessage);
          },
        );
        localStorage.setItem(
          "chatCount",
          String(Number(localStorage.getItem("chatCount")) + 1)
        );
      } catch (e) {
        setChatProcessing(false);
        console.error(e);
      } finally {
        reader.releaseLock();
      }

      // アシスタントの返答をログに追加
      const messageLogAssistant: Message[] = [
        ...messageLog,
        { role: "assistant", content: receivedMessage },
      ];

      setChatLog(messageLogAssistant);
      // 次のコメントをuserMessageにセット

      Promise.all(speakPromises).then(() => {
        setIsAiTalking(false);
        setAiResponseText("");
        setCommentIndex(commentIndex + 1);
        setChatProcessing(false);
      });
      return Promise.all(speakPromises);
    },
    [
      chatLog, 
      openAiKey, 
      setChatProcessing, 
      setChatLog, 
      handleSpeakAi, 
      textToSpeechApiType, 
      setAssistantMessage, 
      setIsAiTalking, 
      setAiResponseText, 
      setCommentIndex, 
      commentIndex
    ]
  );

  return {
    handleSendChat,
    handleSpeakAi,
    koeiroParam,
    getRandomInterjection,
  };
};
