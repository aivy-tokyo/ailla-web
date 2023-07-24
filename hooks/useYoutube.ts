import { 
  youtubeVideoIdAtom, 
  chatCommentsAtom, 
  commentIndexAtom, 
  isYoutubeModeAtom, 
  liveChatIdAtom, 
  userMessageAtom, 
  nextPageTokenAtom, 
  ngwordsAtom, 
  responsedLiveCommentsAtom, 
  isThinkingAtom, 
  isAiTalkingAtom, 
  aiResponseTextAtom,  
  commentOwnerAtom, 
  fortuneTellingTypeAtom,
  isFortuneTellingModeAtom,
  chatProcessingAtom,
  totalResponseCountOfFortuneTellingAtom,
  commentOwnerIconUrlAtom,
  fortuneTellingLabelAtom
} from "@/utils/atoms";
import { useAtom, useSetAtom } from "jotai";
import { useState } from "react";
import { useChat } from "./useChat";
import { useFortuneTelling } from "./useFortuneTelling";
import { exec } from "child_process";
import { textsToScreenplay } from "@/features/messages/messages";
import { getBirthdayFromComment } from "@/features/chat/openAiChat";


export const useYoutube = () => {
  const [liveChatId, setLiveChatId] = useAtom(liveChatIdAtom);
	const [nextPageToken, setNextPageToken] = useAtom(nextPageTokenAtom);
	// const setChatComments = useSetAtom(chatCommentsAtom);
	const setUserMessage = useSetAtom(userMessageAtom);
	const YOUTUBE_DATA_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_DATA_API_KEY;
	// const YOUTUBE_DATA_API_KEY_2 = process.env.NEXT_PUBLIC_YOUTUBE_DATA_API_KEY_2;
	// const YOUTUBE_DATA_API_KEY_3 = process.env.NEXT_PUBLIC_YOUTUBE_DATA_API_KEY_3;
	// const YOUTUBE_DATA_API_KEY_4 = process.env.NEXT_PUBLIC_YOUTUBE_DATA_API_KEY_4;
	// const YOUTUBE_DATA_API_KEY_5 = process.env.NEXT_PUBLIC_YOUTUBE_DATA_API_KEY_5;
	// const YOUTUBE_DATA_API_KEY_6 = process.env.NEXT_PUBLIC_YOUTUBE_DATA_API_KEY_6;
	// const YOUTUBE_DATA_API_KEY_7 = process.env.NEXT_PUBLIC_YOUTUBE_DATA_API_KEY_7;
  // const YOUTUBE_DATA_API_KEY_FOR_GET_LIVE_CHAT_ID = process.env.NEXT_PUBLIC_YOUTUBE_DATA_API_KEY_FOR_GET_LIVE_CHAT_ID;
	const [isYoutubeMode, setIsYoutubeMode] = useAtom(isYoutubeModeAtom);
  // const [chatComments, setChatComments] = useAtom(chatCommentsAtom);
  const chatComments: string[] = [];
  let responsedLiveComments: string[] = [];
  // let totalResponseCountOfFortuneTelling = 0;
  const [totalResponseCountOfFortuneTelling, setTotalResponseCountOfFortuneTelling] = useAtom(totalResponseCountOfFortuneTellingAtom)
  if(typeof window !== 'undefined'){
    responsedLiveComments = JSON.parse(localStorage.getItem('responsedLiveComments') || '[]');
  }
  const [commentIndex, setCommentIndex] = useAtom(commentIndexAtom);
	const [youtubeVideoId, setYoutubeVideoId] = useAtom(youtubeVideoIdAtom); 
	const [ngwords, setNgwords] = useAtom(ngwordsAtom);
	const isLiveCommentsRetrieveStarted = true;
  const [commentOwnerName, setCommentOwnerName] = useAtom(commentOwnerAtom);
  const [commentOwnerIconUrl, setCommentOwnerIconUrl] = useAtom(commentOwnerIconUrlAtom);
  const [fortuneTellingType, setFortuneTellingType] = useAtom(fortuneTellingTypeAtom);
  const setFortuneTellingLabel = useSetAtom(fortuneTellingLabelAtom);
  const [isFortuneTellingMode, setIsFortuneTellingMode] = useAtom(isFortuneTellingModeAtom);
	const [isValidBirthdayFormat, setIsValidBirthdayFormat] = useState(true);
  const [chatProcessing, setChatProcessing] = useAtom(chatProcessingAtom);


	// コメントの取得インターバル (ms)
	const INTERVAL_MILL_SECONDS_RETRIEVING_COMMENTS = 5000;

	// aaQUEUEに積まれたコメントを捌くインターバル (ms)
	const INTERVAL_MILL_SECONDS_HANDLING_COMMENTS = 3000;

	const [isThinking, setIsThinking] = useAtom(isThinkingAtom);
  const [isAiTalking, setIsAiTalking] = useAtom(isAiTalkingAtom);

  const { handleSendChat, handleSpeakAi,koeiroParam } = useChat();
  const {handleSubmitFortuneTelling} = useFortuneTelling();
  const apiKeys = [
    YOUTUBE_DATA_API_KEY
  ];


  // コメント主の名前の文字数を制限し、超えてる場合は「...」で置き換える
  const limitCommentOwnerName = (commentOwnerName: string) => {
    if (commentOwnerName.length >= 7) {
      return commentOwnerName.slice(0, 6) + "..."
    }
    return commentOwnerName
  }

	const getLiveChatId = async () => {
    if(!youtubeVideoId)return;
    
    // if (!apiKeys.some(key => !!key)) return; // All keys are falsy, so return early.
    const response = await fetch('https://youtube.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&id=' + youtubeVideoId + '&key=' + YOUTUBE_DATA_API_KEY, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const json = await response.json();
    if (!json || !json.items || json.items.length === 0) {
      return;
    }
    const liveChatId = json.items[0]?.liveStreamingDetails?.activeLiveChatId;
    // console.log('liveChatId:', liveChatId);
    if (liveChatId) {
      setLiveChatId(liveChatId);
      return liveChatId;
    }
  }

	const retrieveYouTubeLiveComments = (activeLiveChatId: string,excludeKeyIndex: number | null = null) => {
    if (!apiKeys.some(key => !!key)) return; // All keys are falsy, so return early.

    let youtubeDataApiKey: string | undefined;
    // console.log('excludedKeyIndex:',excludeKeyIndex);
    if(excludeKeyIndex !== null){ //使えなかったAPIキーがある場合
      do {
          const randomInt = Math.floor(Math.random() * apiKeys.length);
          // console.log('randomInt', randomInt);
          youtubeDataApiKey = apiKeys[randomInt];
      } while (youtubeDataApiKey === apiKeys[excludeKeyIndex]);
    }else{
      const randomInt = Math.floor(Math.random() * apiKeys.length);
      // console.log('randomInt', randomInt);
      youtubeDataApiKey = apiKeys[randomInt];
    }

    if (!youtubeDataApiKey) {
      console.error('No valid API key available');
      return;
    }
    // console.log('APIKEY:', youtubeDataApiKey);
    let url = "https://youtube.googleapis.com/youtube/v3/liveChat/messages?liveChatId=" + activeLiveChatId + '&part=authorDetails%2Csnippet&key=' + youtubeDataApiKey
    if (nextPageToken !== "") {
        url = url + "&pageToken=" + nextPageToken
    }
    let nextExcludedKeyIndex = excludeKeyIndex;
    fetch(url, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(
        (response) => {
            if (response.status === 403) {
              nextExcludedKeyIndex = apiKeys.indexOf(youtubeDataApiKey);
              // console.log('Changing API key and trying again...');
            } else if (response.status !== 200) {
              throw new Error(`response.status is ${response.status}`);
            }
            return response.json();
        }
    ).then(
        (json) => {
          const items = json?.items;
          let index = 0
          // nextPageToken = json.nextPageToken;
					setNextPageToken(json?.nextPageToken);
          items?.forEach(
            (item:any) => {
              try {
                const username = item.authorDetails.displayName;
                const userIconUrl = item.authorDetails.profileImageUrl;
                if(userIconUrl){
                  setCommentOwnerIconUrl(userIconUrl);
                }
                let message = ""
                if (item.snippet.textMessageDetails != undefined) {
                  // 一般コメント
                  message = item.snippet.textMessageDetails.messageText;
                }
                if (item.snippet.superChatDetails != undefined) {
                  // スパチャコメント
                  message = item.snippet.superChatDetails.userComment;
                }
                // :::で区切っているが、適宜オブジェクトで格納するように変更する。
                const additionalComment = `${username}:::${message}:::${userIconUrl}`;
                if (!chatComments.includes(additionalComment) && message != "") {
                  let isNg = false
                  ngwords.forEach(
                    (ngWord) => {
                      if (additionalComment.includes(ngWord)) {
                        isNg = true
                      }
                    }
                  )
                  if (!isNg) {
                    if (isLiveCommentsRetrieveStarted) {
                      chatComments.push(additionalComment)
                    } else {
                      responsedLiveComments.push(additionalComment);
                    }
                  }
                }
              } catch {
                  // Do Nothing
              }
              index = index + 1
            }
          )
        }
    ).catch((err: string)=>{
      // console.log('ERROR:',err);
    })
    .finally(
        () => {
            setTimeout(retrieveYouTubeLiveComments, INTERVAL_MILL_SECONDS_RETRIEVING_COMMENTS, activeLiveChatId, nextExcludedKeyIndex);
        }
    )
	}

  const isIncludesFortuneTellingKeywords = (text: string) => {
    return text.includes('本質') || text.includes('成功方法') || text.includes('才能') || text.includes('落ち込んだ時の対処法') || text.includes('適職') || text.includes('今日のアドバイス')
  };

	const handleNewLiveCommentIfNeeded = async () => {

    if(isAiTalking) {
      // VTuberが声を発しているときは新規コメントを捌かない
      setTimeout(handleNewLiveCommentIfNeeded, INTERVAL_MILL_SECONDS_HANDLING_COMMENTS);
      return;
    }else if (chatComments.length == 0) {
      // QUEUEがなければ何もしない
      setTimeout(handleNewLiveCommentIfNeeded, INTERVAL_MILL_SECONDS_HANDLING_COMMENTS);
      return;
    }else if (isThinking) {
      // VTuberが応答を考えているときは新規コメントを捌かない
      setTimeout(handleNewLiveCommentIfNeeded, INTERVAL_MILL_SECONDS_HANDLING_COMMENTS);
      return;
    }
    else if (chatProcessing) {
      // VTuberがChat処理中のときは新規コメントを捌かない
      // console.log('chatProcessing中だから何もしないよ')
      setTimeout(handleNewLiveCommentIfNeeded, INTERVAL_MILL_SECONDS_HANDLING_COMMENTS);
      return;
    } 
    else if(!isAiTalking && !isThinking && chatComments.length > 0){
      for (let index in chatComments) {
        if (!responsedLiveComments.includes(chatComments[index])) {
          const arr = chatComments[index].split(":::")
          if (arr.length > 1) {
            responsedLiveComments.push(chatComments[index]);
            setIsThinking(true);
            setUserMessage(arr[1]);
            setCommentOwnerName(limitCommentOwnerName(arr[0]));
            if(isIncludesFortuneTellingKeywords(arr[1])){
              // 占いモードにする
              setIsFortuneTellingMode(true);
              const birthday = getBirthdayFromComment(arr[1]);
              
              // 占いの種類を設定
              const fortuneTellingType = setFortuneTypeFromComment(arr[1]);
              
              // 誕生日が取得できなかった場合
              if(!birthday){
                await handleSpeakAi(
                  textsToScreenplay(['誕生日の形式が間違っているかもしれません'],koeiroParam)[0]
                )
                setIsThinking(false);
                // 次のループに進む
                continue;
              };
              await handleSubmitFortuneTelling(fortuneTellingType, birthday);
              setTotalResponseCountOfFortuneTelling((prevCount)=>{
                return prevCount + 1;
              });
            }
            else{
              setChatProcessing(true);
              await handleSendChat(arr[1]);           
            }
            responsedLiveComments.push(chatComments[index]);
            localStorage.setItem('responsedLiveComments', JSON.stringify(responsedLiveComments));
            break;
          }
        }
      }
    }
    setTimeout(handleNewLiveCommentIfNeeded, 5000);
	}

  // コメントから[#占い]など特定の文言があったら、PIDAPIに投げるためのパラメータ(誕生日: yyyy-mm-dd)をコメントから取得する関数
  // const getBirthdayFromComment = (comment: string) => {
  //   // 正規表現でyyyymmdd形式の数字8桁を検索
  //   const match = comment.match(/\d{4}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])/);

  //   // マッチするものが見つかった場合
  //   if (match) {
  //       const dateString = match[0];
  //       console.log('dateString',dateString);
  //       // yyyy-mm-dd形式にフォーマット
  //       const formattedDate = `${dateString.slice(0, 4)}-${dateString.slice(4, 6)}-${dateString.slice(6, 8)}`;

  //       return formattedDate;
  //   }
  //   console.log('birthday is null');
  //   // マッチするものが見つからなかった場合はnullを返す
  //   return null;
  // }

  // コメントから[#占い]など特定の文言があったら、PIDAPIに投げるためのパラメータ(占いコンテンツの種類)をコメントから取得する関数 
  // #本質　#成功方法 #才能　#落ち込んだ時 #適職・天職 
  const setFortuneTypeFromComment = (comment: string) => {
    const regex =　/(#本質|#成功方法|#才能|#落ち込んだ時|#適職・天職)/g;
    if(comment.includes("本質")){
      setFortuneTellingType('OVERVIEW');
      setFortuneTellingLabel('あなたの本質');
      return 'OVERVIEW'
    }else if(comment.includes("成功方法")){
      setFortuneTellingType('SUCCESS');
      setFortuneTellingLabel('あなたの成功方法');     
      return 'SUCCESS'
    }else if(comment.includes("才能")){
      setFortuneTellingType('TALENT');
      setFortuneTellingLabel('あなたの才能');
      return 'TALENT'
    }else if(comment.includes("落ち込んだ時の対処法")){
      setFortuneTellingType('DEPRESSED');
      setFortuneTellingLabel('落ち込んだ時の対処法');
      return 'DEPRESSED'
    }else if(comment.includes("適職")){
      setFortuneTellingType('VOCATION');
      setFortuneTellingLabel('あなたの適職');
      return 'VOCATION'
    }else if(comment.includes("今日のアドバイス")){
      setFortuneTellingType('TODAY');
      setFortuneTellingLabel('今日のアドバイス');
      return 'TODAY'
    }
    else{
      setFortuneTellingType('OVERVIEW');
      setFortuneTellingLabel('あなたの本質')
      return 'OVERVIEW'
    }
  }

	return { 
		getLiveChatId, 
		YOUTUBE_DATA_API_KEY,
		isYoutubeMode,
		setIsYoutubeMode,
		chatComments,
		commentIndex,
		setCommentIndex,
		liveChatId,
		setLiveChatId,
		setYoutubeVideoId,
		youtubeVideoId,
		retrieveYouTubeLiveComments,
    handleNewLiveCommentIfNeeded,
    limitCommentOwnerName,
	};
}