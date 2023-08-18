import { HeaderUi } from "./HeaderUi";
import { useRouter } from "next/router";

export const UiContainer = () => {
  const router = useRouter();

  return (
    <>
      <HeaderUi />
      <div className="
      fixed bottom-0 left-0 right-0
      grid grid-cols-2 gap-2
      p-2
      ">
        <button className="btn btn-primary text-xs" onClick={() => router.push('/?mode=free-talk')}>
          フリートーク
        </button>
        <button className="btn btn-primary text-xs" onClick={() => router.push('/?mode=situation')}>
          シチュエーショントーク
        </button>
        <button className="btn btn-primary text-xs" onClick={() => router.push('/?mode=repeat-practice')}>
          リピートプラクティス
        </button>
        <button className="btn btn-info text-xs" onClick={() => router.push('/?mode=repeat-practice')}>
          使い方を見る
        </button>
      </div>
    </>
  );
};
