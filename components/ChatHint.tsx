import { AiOutlineCloseCircle } from "react-icons/ai";
import { HiOutlineLightBulb } from "react-icons/hi";
import { Situation, SituationStep } from "@/utils/types";

type ChatHintProps = {
  situation: Situation;
  steps: SituationStep[];
  endPhrase: string | undefined;
  onClose?: () => void;
};
export const ChatHint: React.FC<ChatHintProps> = ({
  steps,
  situation,
  endPhrase,
  onClose,
}) => (
  <div className="hint-container opacity-95 w-screen h-screen z-100 top-0 pt-5 px-3 flex fixed justify-center items-center">
    <div className="relative overflow-y-auto w-full h-7/10 max-w-2xl mx-auto bg-white/80 text-[#47556D] rounded-3xl">
      <button
        className="absolute top-3 right-3 flex items-center justify-center bg-transparent text-[#47556D]"
        onClick={onClose}
      >
        <AiOutlineCloseCircle className="w-[2rem] h-[2rem]" />
      </button>
      <div className="flex flex-col justify-center  w-full px-5 py-3">
        <h2 className="mb-3 font-[700] text-[1.8rem]">
          {situation.titleEnglish}
        </h2>
        <p className="text-left text-sm mb-1">{situation.description}</p>
        <p className="text-sm mb-5">
          {situation.roleOfUser}としてAillaと会話してください。
        </p>
        <div className="h-[0.1rem] mix-blend-multiply bg-[#CED4DE] my-3" />
        <h3 className=" flex items-center text-left font-[700] text-[1.3rem] mb-3">
          <HiOutlineLightBulb className="opacity-60 mr-1" /> 会話のHint
        </h3>
        {steps.map(({ description, hint }, index) => (
          <div key={index} className="text-left mb-3">
            {/* 説明文: ヒントの説明を表示、太字 */}
            <p className="text-sm font-bold">{description}</p>
            {/* ヒント: ヒントの内容を表示、斜体 */}
            <p className="text-sm text-[#7B8392]">{hint}</p>
          </div>
        ))}
        {endPhrase && (
          <>
            <div className="h-[0.1rem] mix-blend-multiply bg-[#CED4DE] my-3" />
            <h3 className="text-lg font-bold">会話の終了</h3>
            <p className="text-sm text-[#7B8392]">
              終了フレーズは 「{endPhrase}」 です
            </p>
          </>
        )}
      </div>
    </div>
  </div>
);
