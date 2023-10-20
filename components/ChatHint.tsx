import { Situation, SituationStep } from "@/utils/types";

type ChatHintProps = {
  situation: Situation;
  steps: SituationStep[];
  endPhrase?: string
};
export const ChatHint: React.FC<ChatHintProps> = ({ steps, situation, endPhrase }) => (
  <div className="hint-container opacity-80 w-screen h-screen z-0 top-0 pt-5 px-3 flex fixed justify-center items-center">
    <div className="overflow-y-auto w-full h-3/5 max-w-2xl mx-auto bg-white/80 text-[#47556D] rounded-3xl">
      <div className="flex flex-col justify-center  w-full px-5 py-3">
        <h2 className="mb-3 font-extrabold text-lg">{situation.titleEnglish}</h2>
        <p className="text-left text-sm mb-5">{situation.description}</p>
        <h3 className="text-lg text-left font-bold mb-1">会話のHint</h3>
        {steps.map(({ description, hint }, index) => (
          <div key={index} className="text-left mb-3">
            {/* 説明文: ヒントの説明を表示、太字 */}
            <p className="text-sm font-bold">{description}</p>
            {/* ヒント: ヒントの内容を表示、斜体 */}
            <p className="text-sm italic">Hint: {hint}</p>
          </div>
        ))}
        <h3 className="text-lg font-bold mt-8">会話の終了</h3>
        <p className="text-sm mt-1">終了フレーズは 「{endPhrase}」 です</p>
      </div>
    </div>
  </div>
);
