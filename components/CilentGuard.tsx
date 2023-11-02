import Image from "next/image";
import { useAtom } from "jotai";
import { FormEvent, PropsWithChildren, useCallback, useState } from "react";
import { clientInfoAtom } from "../utils/atoms";
import axios from "axios";
import { captureException } from "@sentry/nextjs";
import { InputField } from "./InputField";

export const ClientGuard: React.FC<PropsWithChildren> = ({ children }) => {
  const [clientInfo, setClientInfo] = useAtom(clientInfoAtom);
  const [clientCode, setClientCode] = useState<string>("");

  const submitClientInfo = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      try {
        const client = await axios.get(`/api/client`, {
          params: { code: clientCode },
        });

        if (!client.data) {
          throw new Error("Client is not found.");
        }

        const clientLanguage = await axios.get(
          `/api/language?language=${client.data.language.S}`,
        );

        if (!clientLanguage.data) {
          throw new Error("Client language is not found.");
        }

        const clientInfo = {
          code: clientCode,
          language: client.data.language.S,
          formalLanguage: clientLanguage.data.formalLanguage.S,
          speakLanguage: clientLanguage.data.speakLanguage.S,
          learningLanguage: clientLanguage.data.learningLanguage.S,
          situationList: client.data.situations.SS,
          introduction: clientLanguage.data.introduction.S,
          topics: clientLanguage.data.topics.M,
          comeBackGreetings: clientLanguage.data.comeBackGreetings.SS,
          speechApiKey: "",
          speechEndpoint: "",
        };

        setClientInfo(clientInfo);
      } catch (error) {
        captureException(error);
      }
    },
    [clientCode, setClientInfo],
  );

  if (!clientInfo) {
    return (
      <div
        className="flex flex-col w-full h-full justify-center items-center text-center bg-slate-50
      bg-[url('/background/login_background.png')]
      bg-cover
      "
      >
        <h1 className="text-4xl font-bold text-center">
          <Image
            width={215}
            height={132}
            src="/AILLA_logo_b.svg"
            alt="AILLA"
            className="mx-auto"
          />
        </h1>
        <form onSubmit={submitClientInfo}>
          <InputField label="クライアントコードを入力してください">
            <input
              id="code"
              name="code"
              type="text"
              className="input bg-white text-[#47556D] text-center shadow-md"
              placeholder="例: AILLA"
              pattern="[A-Za-z0-9]+"
              title="英数字のみ入力してください"
              value={clientCode}
              onChange={(e) => setClientCode(e.target.value)}
            />
          </InputField>
          <div className="flex justify-center mb-2">
            <button
              type="submit"
              className="
            mr-2 px-[1rem] py-[0.5rem] rounded-[0.8rem]
            text-[1rem] text-white bg-gradient-pink
            "
            >
              送信する
            </button>
          </div>
        </form>
      </div>
    );
  }

  return <>{children}</>;
};
