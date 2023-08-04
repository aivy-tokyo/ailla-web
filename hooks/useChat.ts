import { getChatResponseStream } from "@/features/chat/openAiChat";
import { Message, Screenplay, textsToScreenplay } from "@/features/messages/messages";
import { speakCharacter } from "@/features/messages/speakCharacter";
import { ViewerContext } from "@/features/vrmViewer/viewerContext";

import { aiResponseTextAtom, assistantMessageAtom, chatLogAtom, chatProcessingAtom, commentIndexAtom, isAiTalkingAtom, isThinkingAtom, isYoutubeModeAtom, koeiroParamAtom, liveChatIdAtom, nextPageTokenAtom, ngwordsAtom, responsedLiveCommentsAtom, userMessageAtom, youtubeVideoIdAtom } from "@/utils/atoms";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useCallback, useContext, useState } from "react";
import { SYSTEM_PROMPT } from "@/features/constants/systemPromptConstants";


export const useChat = () => {
	const { viewer } = useContext(ViewerContext);
	const [assistantMessage, setAssistantMessage] = useAtom(assistantMessageAtom);
	const [openAiKey, setOpenAiKey] = useState(process.env.NEXT_PUBLIC_OPEN_AI_API_KEY || "");  
	// const [chatProcessing, setChatProcessing] = useState(false);
	const setChatProcessing = useSetAtom(chatProcessingAtom);
	const [chatLog, setChatLog] = useAtom(chatLogAtom);
  const koeiroParam = useAtomValue(koeiroParamAtom);
	const [commentIndex, setCommentIndex] = useAtom(commentIndexAtom);
  const [aiResponseText, setAiResponseText] = useAtom(aiResponseTextAtom);
  const isYoutubeMode = useAtomValue(isYoutubeModeAtom);
  const setUserMessage = useSetAtom(userMessageAtom);
  const [isThinking,setIsThinking] = useAtom(isThinkingAtom);
  const [isAiTalking , setIsAiTalking] = useAtom(isAiTalkingAtom);

  // TODO: 具体的な間投詞は要検討（汎用性がひくそうなものは現段階でコメントアウト）
  const interjections = [
    // 'そうだなぁ', 
    // 'そうだねぇ', 
    'んー', 
    'えーと', 
    'うーん', 
    'うーんと', 
    // 'えーっとですね', 
    'ふーん',
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
      return speakCharacter(screenplay, viewer, onStart, onEnd);
    },
    [viewer]
  );

	/**
   * アシスタントとの会話を行う
   * ここで、ユーザーの発言をどのAPIに送るかを決める（PID占いAPI、普通のchatGPT）
   */
	const handleSendChat = useCallback(
    async (text: string, birthday?: string) => {
      if (!openAiKey) {
        setAssistantMessage("APIキーが入力されていません");
        return;
      }

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
          content: SYSTEM_PROMPT,
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
          if (done) break;

          receivedMessage += value;

          // 返答内容のタグ部分の検出
          const tagMatch = receivedMessage.match(/^\[(.*?)\]/);
          if (tagMatch && tagMatch[0]) {
            tag = tagMatch[0];
            receivedMessage = receivedMessage.slice(tag.length);
          }

          // 返答を一文単位で切り出して処理する
          const sentenceMatch = receivedMessage.match(
            /^(.+[。．！？\n]|.{10,}[、,])/
          );
          if (sentenceMatch && sentenceMatch[0]) {
            const sentence = sentenceMatch[0];
            sentences.push(sentence);
            receivedMessage = receivedMessage
              .slice(sentence.length)
              .trimStart();

            // 発話不要/不可能な文字列だった場合はスキップ
            if (
              !sentence.replace(
                /^[\s\[\(\{「［（【『〈《〔｛«‹〘〚〛〙›»〕》〉』】）］」\}\)\]]+$/g,
                ""
              )
            ) {
              continue;
            }

            setAiResponseText((prev)=> prev + sentence);
            // ↑ここまでは、ttsAPIの種類に関わらず必要な処理かなと推測
            const aiText = `${tag} ${sentence}`;
            const aiTalks = textsToScreenplay([aiText], koeiroParam);
            aiTextLog += aiText;

            // 文ごとに音声を生成 & 再生、返答を表示
            const speakPromise = handleSpeakAi(aiTalks[0]);
            speakPromises.push(speakPromise)

            // voiceVox用処理
            // const context = new AudioContext;

            // context.outStream = new Speaker({
            //   channels: context.format.numberOfChannels,
            //   bitDepth: context.format.bitDepth,
            //   sampleRate: context.sampleRate,
            // });

            // context.decodeAudioData(createAudio(sentence, 1), (audioBuffer: Buffer) => {
            //   const bufferNode = context.createBufferSource();
            //   bufferNode.connect(context.destination);
            //   bufferNode.buffer = audioBuffer;
            //   bufferNode.start(0);
            // })
          }
        }
      } catch (e) {
        setChatProcessing(false);
        console.error(e);
      } finally {
        reader.releaseLock();
      }

      // アシスタントの返答をログに追加
      const messageLogAssistant: Message[] = [
        ...messageLog,
        { role: "assistant", content: aiTextLog },
      ];

      setChatLog(messageLogAssistant);
      // 次のコメントをuserMessageにセット

      Promise.all(speakPromises).then(() => {
        setIsAiTalking(false);
        setAiResponseText("");
        setCommentIndex(commentIndex + 1);
        setChatProcessing(false);
        setUserMessage('');
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
	}
}
