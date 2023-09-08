import { useContext, useEffect, useState } from "react";
import { HeaderUi } from "./HeaderUi";
import { useRouter } from "next/router";
import { ViewerContext } from "../features/vrmViewer/viewerContext";
import { useAtomValue, useSetAtom } from "jotai";
import { chatLogAtom, isVoiceInputAllowedAtom } from "../utils/atoms";
import { useVoiceInput } from "../hooks/useVoiceInput";

export const UiContainer = () => {
  const router = useRouter();
  const { viewer } = useContext(ViewerContext);
  const isVoiceInputAllowed = useAtomValue(isVoiceInputAllowedAtom);
  const setChatLog = useSetAtom(chatLogAtom);

  useEffect(() => {
    viewer.model?.stopSpeak();
    setChatLog([]);
  }, [setChatLog, viewer.model]);

  const { getUserMediaPermission } = useVoiceInput({});
  useEffect(() => {
    if (!isVoiceInputAllowed) {
      getUserMediaPermission();
    }
  }, [getUserMediaPermission, isVoiceInputAllowed]);

  return (
    <>
      <HeaderUi />
      <div
        className="
      fixed bottom-0 left-0 right-0
      grid grid-cols-2 gap-2
      p-2
      "
      >
        <button
          className="btn btn-primary text-xs"
          onClick={() => router.push("/?mode=free-talk")}
        >
          フリートーク
        </button>
        <button
          className="btn btn-primary text-xs"
          onClick={() => router.push("/?mode=situation")}
        >
          シチュエーショントーク
        </button>
        <button
          className="btn btn-primary text-xs"
          onClick={() => {
            // @ts-ignore
            modal_comming_soon.showModal();
          }}
        >
          リピートプラクティス
        </button>
        <button
          className="btn btn-info text-xs"
          onClick={() => {
            // @ts-ignore
            modal_help.showModal();
          }}
        >
          使い方を見る
        </button>
      </div>
      {/* Open the modal using document.getElementById('ID').showModal() method */}
      <dialog id="modal_comming_soon" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Coming Soon</h3>
          <p className="py-4">
            この機能は現在準備中です。
            <br />
            しばらくお待ちください。
          </p>
          <div className="modal-action">
            <form method="dialog" className="flex justify-center w-full">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">とじる</button>
            </form>
          </div>
        </div>
      </dialog>
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
    </>
  );
};
