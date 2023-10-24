import { AiOutlineCloseCircle } from "react-icons/ai";

export const HelpDialog = () => {
  return (
    <dialog id="modal_help" className="modal">
      <div className="modal-box bg-white/80 text-[#47556D]">
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-2xl w-2/5">使い方</h2>
          <form method="dialog" className="bg-transparent flex justify-end items-center h-full w-3/5">
            {/* if there is a button in form, it will close the modal */}
            <button>
              <AiOutlineCloseCircle className="w-[2rem] h-[2rem]" />
            </button>
          </form>
        </div>
        <p className="py-4">
          このアプリでは、Aillaと英語で会話をすることができます。
          <br />
          英会話の練習には3つのモードがあります。
          <div className="w-full my-5 bg-[#CED4DE] border-b h-[0.1rem] border-[#CED4DE]" />
          <strong>1. フリートークモード</strong>
          <br />
          <strong>2. シチュエーションモード</strong>
          <br />
          <strong>3. リピートプラクティスモード</strong>
          <br />
          <br />
          <div className="w-full my-2 bg-[#CED4DE] border-b h-[0.1rem] border-[#CED4DE]" />
          <strong>フリートークモード</strong>
          では、自由に会話をすることができます。
          <br />
          <strong>シチュエーションモード</strong>
          では、シチュエーションに沿った会話をすることができます。
          <br />
          <strong>リピートプラクティスモード</strong>
          では、Aillaが英語を話すので、それを聞いてリピートすることで発音の練習をすることができます。
          <br />
          <br />
          モードを選択すると、会話が始まります。
        </p>
      </div>
    </dialog>
  );
};
