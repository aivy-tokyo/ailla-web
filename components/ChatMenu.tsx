type ChatMenuProps = {};
export const ChatMenu: React.FC<ChatMenuProps> = () => (
  <div className="hint-container opacity-80 w-screen h-screen -z-0 top-12 flex fixed">
    {/* ヒント領域のコンテナ。画面いっぱいに広げて、中のヒント領域をflex/items-centerで画面の中央に配置(他のUIをさわれなくならないよう微調整済み) */}
    <div className="w-full flex items-center max-w-[900px] justify-center m-auto">
      <div className="grid grid-cols-2 w-[95%] m-auto relative -top-8">
        <div className="bg-black opacity-75 cursor-pointer rounded-md w-[95%] h-10 m-auto  my-3 px-2 text-center flex items-center justify-center">
          ボタン1ボタン1ボタン1ボタン
        </div>
        <div className="bg-black opacity-75 cursor-pointer rounded-md w-[95%] h-10 m-auto  my-3 px-2 text-center flex items-center justify-center">
          ボタン2ボタン2ボタン2ボタン
        </div>
        <div className="bg-black opacity-75 cursor-pointer rounded-md  w-[95%] px-2 h-10 m-auto my-3 text-center flex items-center justify-center">
          ボタン3ボタン3ボタン3ボタン
        </div>
        <div className="bg-black opacity-75 cursor-pointer rounded-md  w-[95%] px-2 h-10 m-auto my-3 text-center flex items-center justify-center">
          ボタン4ボタン4ボタン4ボタン
        </div>
      </div>
    </div>
  </div>
);
