//シチュエーション会話終了ボタン
const endTalkButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <button className="
    btn btn-outline text-white
    hover:bg-white
    hover:bg-opacity-40
    "
    onClick={onClick}>
      <span>会話を終了</span>
    </button>
  );
};

export default endTalkButton;