type ChatHintProps = {};
export const ChatHint: React.FC<ChatHintProps> = () => (
  <div className="hint-container opacity-80 w-screen h-screen -z-0 top-12 flex fixed">
    {/* ヒント領域のコンテナ。画面いっぱいに広げて、中のヒント領域をflex/items-centerで画面の中央に配置(他のUIをさわれなくならないよう微調整済み) */}
    <div className="w-full flex items-center max-w-[900px] justify-center m-auto">
      <div className="w-[95%] h-[120px] bg-black opacity-75 text-white rounded-3xl m-auto relative -top-8  px-5 py-3 overflow-y-scroll">
        これはヒントです。これはヒントです。これはヒントです。これはヒントです。
        これはヒントです。これはヒントです。これはヒントです。これはヒントです。
        これはヒントです。これはヒントです。これはヒントです。これはヒントです。
        これはヒントです。
        これはヒントです。これはヒントです。これはヒントです。これはヒントです。
        これはヒントです。これはヒントです。これはヒントです。これはヒントです。
        これはヒントです。これはヒントです。これはヒントです。これはヒントです。
        これはヒントです。
      </div>
    </div>
  </div>
);
