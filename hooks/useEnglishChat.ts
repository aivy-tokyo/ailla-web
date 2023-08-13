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
  isYoutubeModeAtom,
  koeiroParamAtom,
} from "@/utils/atoms";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useCallback, useContext, useState } from "react";
import {
  SYSTEM_PROMPT_FOR_ENGLISH_CONVERSATION,
} from "@/features/constants/systemPromptConstants";
import { speakEnglishCharacter } from "@/features/messages/speakEnglishCharacter";


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
  const isYoutubeMode = useAtomValue(isYoutubeModeAtom);
  const [openAiKey, setOpenAiKey] = useState(process.env.NEXT_PUBLIC_OPENAI_API_KEY);

  const [, setIsThinking] = useAtom(isThinkingAtom);
  const [isAiTalking, setIsAiTalking] = useAtom(isAiTalkingAtom);

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
      onStart?: () => void,
      onEnd?: () => void
    ): Promise<void> => {
      return speakEnglishCharacter(screenplay, viewer, onStart, onEnd);
    },
    [viewer]
  );

  /**
   * アシスタントとの会話を行う
   * ここで、ユーザーの発言をどのAPIに送るかを決める（PID占いAPI、普通のchatGPT）
   */
  const handleSendChat = useCallback(
    async (text: string) => {
      if (!openAiKey) {
        console.error("APIキーが入力されていません");
        return;
      }

      // Check if the chat limit is exceeded
      const lastChatDate = new Date(localStorage.getItem("lastChatDate") || "");
      const chatCount = Number(localStorage.getItem("chatCount"));
      if (!checkChatLimit(lastChatDate, chatCount)) {
        const randomIndex = Math.floor(
          Math.random() * exceededChatLimitMessages.length
        );
        const exceededChatLimitMessage = exceededChatLimitMessages[randomIndex];
        handleSpeakAi(
          {
            talk: {
              message: exceededChatLimitMessage,
              speakerX: 1,
              speakerY: 1,
              style: "talk",
            },
            expression: "neutral",
          },
          () => {
            setAssistantMessage(exceededChatLimitMessage);
          }
        );
        setChatLog((prev) => [
          ...prev,
          { role: "assistant", content: exceededChatLimitMessage },
        ]);
        return;
      } else {
        // If the chat limit is not exceeded, update the chat count and chat date
        localStorage.setItem("chatCount", String(isToday(lastChatDate) ? chatCount + 1 : 1));
        localStorage.setItem("lastChatDate", String(new Date()));
      }

      const newMessage = text;

      if (newMessage == null) return;

      setChatProcessing(true);
      // 間投詞をランダムに追加(間を埋めるため)
      // handleSpeakAi(textsToScreenplay([getRandomInterjection()], koeiroParam)[0]);

      // ユーザーの発言を追加して表示
      const messageLog: Message[] = [
        ...chatLog,
        { role: "user", content: newMessage },
      ];
      setChatLog(messageLog);
      // いったんDBなしで動作させるためにコメントアウト
      // const promptForChat = await fetchPrompt('CHAT').then(res => res.text);

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
      let aiTextLog = "";
      let tag = "";
      const sentences = new Array<string>();
      const speakPromises: Promise<any>[] = []; //各センテンスの発話のPromiseを格納する配列
      try {
        while (true) {
          const { done, value } = await reader.read();
          console.log("value", value);
          if (done) break;

          receivedMessage += value;

          // 返答内容のタグ部分の検出
          // const tagMatch = receivedMessage.match(/^\[(.*?)\]/);
          // if (tagMatch && tagMatch[0]) {
          //   tag = tagMatch[0];
          //   receivedMessage = receivedMessage.slice(tag.length);
          // }

          // 返答を一文単位で切り出して処理する
          // const sentenceMatch = receivedMessage.match(
          //   /^(.+[。．！？\n]|.{10,}[、,])/
          // );
          // if (sentenceMatch && sentenceMatch[0]) {
          //   const sentence = sentenceMatch[0];
          //   sentences.push(sentence);
          //   receivedMessage = receivedMessage
          //     .slice(sentence.length)
          //     .trimStart();

          //   // 発話不要/不可能な文字列だった場合はスキップ
          //   if (
          //     !sentence.replace(
          //       /^[\s\[\(\{「［（【『〈《〔｛«‹〘〚〛〙›»〕》〉』】）］」\}\)\]]+$/g,
          //       ""
          //     )
          //   ) {
          //     continue;
          //   }

          // setAiResponseText((prev)=> prev + sentence);
          // const aiText = `${tag} ${sentence}`;
          // const aiTalks = textsToScreenplay([aiText], koeiroParam);
          // aiTextLog += aiText;

          // if(isYoutubeMode){
          //   // 文ごとに音声を生成 & 再生、返答を表示
          //   const speakPromise = handleSpeakAi(aiTalks[0],
          //     () => {
          //       setIsThinking(false)
          //       setIsAiTalking(true);
          //     },
          //     () => {});
          //   speakPromises.push(speakPromise);
          // }else{
          //   // 文ごとに音声を生成 & 再生、返答を表示
          //   const currentAssistantMessage = sentences.join(" ");
          //   handleSpeakAi(aiTalks[0], () => {
          //     setAssistantMessage(currentAssistantMessage);
          //   });
          // }
          // }
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
          () => {
            setAssistantMessage(receivedMessage);
          }
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
      handleSpeakAi,
      setCommentIndex,
      setTimeout,
      openAiKey,
      koeiroParam,
      isAiTalking,
      setIsAiTalking,
      setIsThinking,
      isYoutubeMode,
    ]
  );

  return {
    handleSendChat,
    handleSpeakAi,
    koeiroParam,
    getRandomInterjection,
  };
};
