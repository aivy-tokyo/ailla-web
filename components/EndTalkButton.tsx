import {AiOutlineCloseCircle} from 'react-icons/ai';

//シチュエーション会話終了ボタン
const endTalkButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <button
      className="
        flex
        items-center
        justify-center
        bg-transparent
        text-[#47556D]
      "
      onClick={onClick}
    >
      <AiOutlineCloseCircle className="w-[2rem] h-[2rem] mr-[1rem]" />
    </button>
  );
};

export default endTalkButton;