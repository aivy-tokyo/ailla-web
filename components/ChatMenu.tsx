export type MenuOption = {
  label: string;
  value: string;
};
type ChatMenuProps = {
  options: MenuOption[];
  onClickOption: (value: string) => void;
};
export const ChatMenu: React.FC<ChatMenuProps> = ({
  options,
  onClickOption,
}) => (
  <div className="hint-container text-white w-screen h-screen -z-0 top-12 flex fixed">
    {/* ヒント領域のコンテナ。画面いっぱいに広げて、中のヒント領域をflex/items-centerで画面の中央に配置(他のUIをさわれなくならないよう微調整済み) */}
    <div className="w-full flex items-center max-w-[900px] justify-center m-auto">
      <div className="grid grid-cols-2 w-[95%] m-auto relative -top-8">
        {options.map((option) => (
          <button
            key={option.value}
            className="bg-black cursor-pointer rounded-md w-[95%] h-10 m-auto  my-3 px-2 text-center flex items-center justify-center"
            onClick={() => onClickOption(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  </div>
);
