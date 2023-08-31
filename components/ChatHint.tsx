import { Situation } from "@/features/situations";

type ChatHintProps = {
  description: string;
  hint: string;
  situation: Situation;
};
export const ChatHint: React.FC<ChatHintProps> = ({ description, hint, situation }) => (
  <div className="hint-container opacity-80 w-screen h-screen -z-0 top-12 flex fixed">
    {/* ヒント領域のコンテナ。画面いっぱいに広げて、中のヒント領域をflex/items-centerで画面の中央に配置(他のUIをさわれなくならないよう微調整済み) */}
    <div className="w-full flex items-center max-w-[900px] justify-center m-auto">
      <div className="flex flex-col justify-center items-center w-[95%] h-[150px] bg-black text-white rounded-3xl m-auto relative -top-8  px-5 py-3 overflow-y-scroll">
        <h2 className=" font-extrabold text-lg">{situation.title}</h2>
        <h3 className=" text-sm">{situation.description}</h3>
        <p className="text-sm mb-5">{situation.roleOfUser}としてAILLAと会話してください。</p>
        {/* 説明文: ヒントの説明を表示、太字 */}
        <p className="text-lg font-bold">{description}</p>
        {/* ヒント: ヒントの内容を表示、斜体 */}        
        <p className="text-sm italic">Hint: {hint}</p>
      </div>
    </div>
  </div>
);
