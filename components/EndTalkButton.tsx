//シチュエーション会話終了ボタン
const endTalkButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <button className="
    bg-transparent
    text-white
    border
    border-white
    p-1
    h-7
    w-28
    text-sm
    rounded-md
    "
    onClick={onClick}>
      <span>会話を終了</span>
    </button>
  );
};

export default endTalkButton;