import { aiResponseTextAtom, fortuneTellingLabelAtom, fortuneTellingTypeAtom, isAiTalkingAtom, isFortuneTellingModeAtom, isFortuneTellingProcessingAtom, isThinkingAtom } from "@/utils/atoms";
import { useAtom, useSetAtom } from "jotai";
import { useCallback, useState } from "react";
import { useChat } from "./useChat";
import { FortuneTellingType, PidResponse, Sex } from "@/utils/types";
import { textsToScreenplay } from "@/features/messages/messages";
import { Message } from "@/features/messages/messages";
import { PROMPT_FOR_PID_REWRITE } from "@/features/constants/systemPromptConstants";
import { fetchPrompt, getChatResponseStream } from "@/features/chat/openAiChat";
import { MAX_TOKENS } from "@/features/constants/systemPromptConstants";


export const useFortuneTelling = () => {
	const [isFortuneTellingMode, setIsFortuneTellingMode] = useAtom(isFortuneTellingModeAtom);
  const [fortuneTellingType, setFortuneTellingType] = useAtom(fortuneTellingTypeAtom);
	const setFortuneTellingLabel = useSetAtom(fortuneTellingLabelAtom);
	const [isValidBirthdayFormat, setIsValidBirthdayFormat] = useState(true);
	const setIsFortuneTellingProcessing = useSetAtom(isFortuneTellingProcessingAtom);
	const [birthday, setBirthday] = useState(() => {
		if (typeof window === "undefined")return "";
		return localStorage.getItem("birthday") || "";
	});
	const { handleSpeakAi,koeiroParam } = useChat();
	const [isThinking, setIsThinking] = useAtom(isThinkingAtom);
  const [isAiTalking, setIsAiTalking] = useAtom(isAiTalkingAtom);
	const [aiResponseText, setAiResponseText] = useAtom(aiResponseTextAtom);


	const fortuneTellingTypeList:{type: FortuneTellingType, label: string}[] = [
		{ type: "OVERVIEW", label: "あなたの本質" },
		{ type: "SUCCESS", label: "あなたが成功するには"},
		{ type: "TALENT", label: "あなたの隠れた才能"},
		{ type: "DEPRESSED", label: "あなたが落ち込んだ時の対処法"},
		{ type: "VOCATION", label: "あなたの適職・天職"},
		{ type: "TODAY", label: "今日のアドバイス"},
	];

	const validateBirthday = useCallback(
		(birthday: string) => {
			const regex = /^\d{4}-\d{2}-\d{2}$/;
			return regex.test(birthday);
		},
		[birthday]
	);
	const [sex,setSex] = useState<Sex | undefined>(undefined);

	// MEMO: GPTによるリライトは、handleSendChat()のgetResponseStreamより下をほぼ丸々ペーストしている。共通の部分は関数化するなど、リファクタリングした方が良い。
	const executeFortuneTelling = useCallback(
		async (fortuneTellingType: FortuneTellingType | undefined, birthday: string) => {
			let Url = `/api/proxy?pin=CID020096537_DIV&pass=R23e6577w9Gk2&content_code=${fortuneTellingType}&birthday=${birthday}`;
			// MEMO: TODAYの場合のみ性別、職業など他のパラメーターがオプションで使えるが、まずは他と同じく誕生日のみとする
			// if(fortuneTellingType === "TODAY" && sex !== undefined){
			// 	Url = `${Url}&sex=${sex}`
			// }
			const response = await fetch(Url,
  			{
  				method: "GET",
  				headers: {
  					"Content-Type": "application/json",
  				},
  			}
  		);
  		const data: PidResponse = await response.json();
			// DBに保存されているプロンプトを取得する
			// const promptForFortuneRewrite = await fetchPrompt('FORTUNE_REWRITE').then(res => res.text);
			const speakPromises: Promise<any>[] = []; //各センテンスの発話のPromiseを格納する配列
			const messages: Message[] = [];
			// messagesへ、PIDからのレスポンスを追加
			// messages.push({role: 'system', content: promptForFortuneRewrite || PROMPT_FOR_PID_REWRITE});
			messages.push({role: 'system', content: PROMPT_FOR_PID_REWRITE});
			messages.push({role: 'user', content: data.voiceText});
			// GPTのAPIを叩いてレスポンスを取得
			const gptStream = await getChatResponseStream(messages, process.env.NEXT_PUBLIC_OPEN_AI_API_KEY || "", MAX_TOKENS).catch(
        (e) => {
          console.error(e);
          return null;
        }
      );
			if (gptStream === null) {
				return;
			}
			// 以下、handleSendChatのペーストがほとんど
			const reader = gptStream.getReader();
      let receivedMessage = "";
      let aiTextLog = "";
      let tag = "";
      const sentences = new Array<string>();
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
            const aiText = `${tag} ${sentence}`;
            const aiTalks = textsToScreenplay([aiText], koeiroParam);
            aiTextLog += aiText;

            const speakPromise = handleSpeakAi(aiTalks[0],
              () => {
                setIsThinking(false)
                setIsAiTalking(true);
								setIsFortuneTellingProcessing(false)
              },
              () => {});
            speakPromises.push(speakPromise);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        reader.releaseLock();
      }

			Promise.all(speakPromises).then(() => {
        setIsAiTalking(false);
        setAiResponseText("");
				setFortuneTellingType(undefined);
				setFortuneTellingLabel(undefined);
      });
        return Promise.all(speakPromises);
		},
		[
			fortuneTellingType,
			birthday,
		]
	);
	// const executeFortuneTelling = useCallback(
	// 	async (fortuneTellingType: FortuneTellingType | undefined, birthday: string) => {
	// 		let Url = `/api/proxy?pin=CID020096537_DIV&pass=R23e6577w9Gk2&content_code=${fortuneTellingType}&birthday=${birthday}`;
	// 		if(fortuneTellingType === "TODAY" && sex !== undefined){
	// 			Url = `${Url}&sex=${sex}`
	// 		}
	// 		const response = await fetch(Url,
  // 			{
  // 				method: "GET",
  // 				headers: {
  // 					"Content-Type": "application/json",
  // 				},
  // 			}
  // 		);
  // 		const data: PidResponse = await response.json();
	// 		const speakPromises: Promise<any>[] = []; //各センテンスの発話のPromiseを格納する配列
	// 		// TODO: ここにGPTへのリライト処理を入れる
	// 		const messages: Message[] = [];
	// 		// messagesへ、PIDからのレスポンスを追加
	// 		console.log('PIDのdata', data);
	// 		messages.push({role: 'user', content: data.voiceText});
	// 		messages.push({role: 'system', content: PROMPT_FOR_PID_REWRITE});

	// 		console.log(messages);
	// 		// GPTのAPIを叩いてレスポンスを取得
	// 		const gptStream = await getChatResponseStream(messages, process.env.NEXT_PUBLIC_OPEN_AI_API_KEY || "").catch(
  //       (e) => {
  //         console.error(e);
  //         return null;
  //       }
  //     );
	// 		console.log('gptStream', gptStream);
	// 		if(!gptStream)return;
  //     const reader = gptStream?.getReader();
	// 		let chunks = [];
	// 		let done = false;

	// 		while (!done) {
	// 		  const {value, done: chunkDone} = await reader.read();
	// 		  if(chunkDone){
	// 		    done = true;
	// 		  }
	// 		  else{
	// 		    chunks.push(value);
	// 		  }
	// 		}

	// 		let gptResponse = new Uint8Array(chunks.flat().reduce((acc, val) => acc.concat(Array.from(val)), []));
	// 		let text = new TextDecoder().decode(gptResponse);
	// 		// console.log('JSON.parse(text)->', JSON.parse(text));
	// 		console.log('text', text);

			

	// 		// ここまでGPTへのリライト処理
	// 		for(const eachText of data.voiceText.split('。')){
	// 			setAiResponseText((prev: string) => `${prev}${prev !== '' ? '。' : ''}${eachText}`);
	// 			// await delay(9000);
	// 			const speakPromise = await handleSpeakAi(
	// 				textsToScreenplay([eachText],koeiroParam)[0],
	// 				()=> {
	// 					setIsFortuneTellingProcessing(false)
	// 					setIsThinking(false);
	// 					setIsAiTalking(true);
	// 				});
	// 				// @ts-ignore
	// 			speakPromises.push(speakPromise);
	// 		}
	// 		await Promise.all(speakPromises).then(() => {
	// 			setIsAiTalking(false);
	// 			setAiResponseText("");
	// 		});
	// 		return Promise.all(speakPromises);
	// 	},
	// 	[
	// 		fortuneTellingType,
	// 		birthday,
	// 	]
	// );

  const handleSubmitFortuneTelling = useCallback(
  	async (fortuneTellingType : FortuneTellingType | undefined, birthday: string) => {
			setIsFortuneTellingProcessing(true);
  		if(fortuneTellingType === "OVERVIEW" && isValidBirthdayFormat){
  			await handleSpeakAi(textsToScreenplay(["あなたの本質を占っています。ちょっと待ってくださいね。"],koeiroParam)[0]);
  			await executeFortuneTelling(fortuneTellingType, birthday);
  		}else if(fortuneTellingType === "SUCCESS" && isValidBirthdayFormat){
				await handleSpeakAi(textsToScreenplay(["あなたの成功方法を占っています。ちょっと待ってくださいね。"],koeiroParam)[0]);
				await executeFortuneTelling(fortuneTellingType, birthday);
			}else if(fortuneTellingType === "TALENT" && isValidBirthdayFormat){
				await handleSpeakAi(textsToScreenplay(["あなたの隠れた才能を占っています。ちょっと待ってくださいね。"],koeiroParam)[0]);
				await executeFortuneTelling(fortuneTellingType, birthday);
			}else if(fortuneTellingType === "DEPRESSED" && isValidBirthdayFormat){
				await handleSpeakAi(textsToScreenplay(["あなたが落ち込んだ時の対処法を占っています。ちょっと待ってくださいね。"],koeiroParam)[0]);
				await executeFortuneTelling(fortuneTellingType, birthday);
			}else if(fortuneTellingType === "VOCATION" && isValidBirthdayFormat){
				await handleSpeakAi(textsToScreenplay(["あなたの適職と天職を占っています。ちょっと待ってくださいね。"],koeiroParam)[0]);
				await executeFortuneTelling(fortuneTellingType, birthday);
			}else if(fortuneTellingType === "TODAY" && isValidBirthdayFormat){
				await handleSpeakAi(textsToScreenplay(["あなたへの今日のアドバイスを占っています。ちょっと待ってくださいね。"],koeiroParam)[0]);
				await executeFortuneTelling(fortuneTellingType, birthday);
			}
  	},
  	[fortuneTellingType]
  );
  return {
		fortuneTellingTypeList,

		handleSubmitFortuneTelling,

		isFortuneTellingMode,
		setIsFortuneTellingMode,

		fortuneTellingType,
		setFortuneTellingType,

		birthday,
		setBirthday,

		validateBirthday,
		
		isValidBirthdayFormat,
		setIsValidBirthdayFormat,

		sex,
		setSex,
		setIsFortuneTellingProcessing,

	};
};