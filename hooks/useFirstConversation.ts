import { useUserInfo } from "./useUserInfo";

const INTRODUCTION_GREETING = `Hi {UserName}! I'm AILLA, your English conversation partner. Let's have a fun and engaging chat together!`;
const APP_EXPLANATION = `
このアプリでは、AILLAと英語で会話をすることができます。
英会話の練習には3つのモードがあります。
1. フリートークモード
2. シチュエーションモード
3. リピートプラクティスモード
フリートークモードでは、自由に会話をすることができます。
シチュエーションモードでは、シチュエーションに沿った会話をすることができます。
リピートプラクティスモードでは、AILLAが英語を話すので、それを聞いてリピートすることで発音の練習をすることができます。
`;

// アイスブレイクの会話をする関数
const talkIceBreak = (messages: string[]) => {

// 初回会話の内容を返す
// アプリの説明をしていない場合は、はじめましての挨拶とアプリの説明をする
// アプリの説明をしている場合は、アイスブレイクの会話をする
export const useFirstConversation = () => {
  // userのhasExplainedFirstAppを取得
  const { userInfo } = useUserInfo();
  const hasExplainedFirstApp = userInfo?.hasExplainedFirstApp ?? false;

  // hasExplainedFirstAppがfalseの場合、初回会話を行う
  const [isFirstConversation, setIsFirstConversation] = useState(!hasExplainedFirstApp);

  // 初回会話のメッセージを返す
  const getFirstConversation = useCallback(() => {
    return FIRST_CONVERSATOIN.replace("{UserName}", userInfo?.name ?? "");
  }
  , [userInfo]);

  return { isFirstConversation, getFirstConversation };
};
