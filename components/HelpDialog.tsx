export const HelpDialog = () => {
  return (
    <dialog id="modal_help" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">使い方</h3>
        <p className="py-4">
          このアプリでは、Aillaと英語で会話をすることができます。
          <br />
          英会話の練習には3つのモードがあります。
          <br />
          <br />
          <strong>1. フリートークモード</strong>
          <br />
          <strong>2. シチュエーションモード</strong>
          <br />
          <strong>3. リピートプラクティスモード</strong>
          <br />
          <br />
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
        <div className="modal-action">
          <form method="dialog" className="flex justify-center w-full">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn">とじる</button>
          </form>
        </div>
      </div>
    </dialog>
  )
}