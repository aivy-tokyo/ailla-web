import { Situation, SituationStep } from "@/utils/types";

type ChatHintProps = {
  situation: Situation;
  steps: SituationStep[];
};
export const ChatHint: React.FC<ChatHintProps> = ({ steps, situation }) => (
  <div className="hint-container opacity-80 w-screen h-screen z-0 top-0 pt-5 px-3 flex fixed">
    <div className="overflow-y-auto w-full h-3/5 max-w-2xl mx-auto bg-black text-white rounded-3xl">
      <div className="flex flex-col justify-center items-center w-full px-5 py-3">
        <h2 className="mb-3 font-extrabold text-lg">{situation.title}</h2>
        <p className="text-sm mb-3 font-bold">
          {situation.roleOfUser}としてAillaと会話してください。
        </p>
        <p className="text-center text-sm mb-5">{situation.description}</p>
        <h3 className="text-lg font-bold mb-1">会話のHint</h3>
        {steps.map(({ description, hint }, index) => (
          <div key={index} className="text-center mb-3">
            {/* 説明文: ヒントの説明を表示、太字 */}
            <p className="text-sm font-bold">{description}</p>
            {/* ヒント: ヒントの内容を表示、斜体 */}
            <p className="text-sm italic">Hint: {hint}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);
