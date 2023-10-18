import { ButtonTalkMode } from "./ButtonTalkMode";

export type MenuOption = {
  label: string;
  english: string;
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
    <div className="w-full flex flex-col items-center max-w-[900px] justify-center m-auto">
      <h1 className="text-[1.5rem] -z-0 text-[#47556D] text-center font-[700] mb-7">
        シチュエーションを
        <br/>
        選択してください
      </h1>
      <div className="flex flex-col justify-center items-center gap-4">
        {options.map((option) => (
          <ButtonTalkMode
            key={option.value}
            item={{
              title: option.label,
              englishTitle: option.english,
              onClick: () => onClickOption(option.value),
            }}
          />
        ))}
      </div>
    </div>
  </div>
);
