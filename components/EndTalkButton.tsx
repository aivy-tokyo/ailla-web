//シチュエーション会話終了ボタン
const endTalkButton = () => {
  /* 
  button style
  background-color: transparent;
    color: white;
    border: 1px solid;
    padding: 2px;
    line-height: 1;
    height: 28px;
    width: 7em;
    margin-top: 6px;
    font-size: 12px;
}
  */
  return (
    <button className="
    bg-transparent
    text-white
    border
    border-white
    p-1
    h-7
    w-28
    mt-1.5
    mr-1.5
    text-sm
    rounded-md
    ">
      <span>会話を終了</span>
    </button>
  );
};

export default endTalkButton;