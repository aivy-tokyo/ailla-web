import { Message } from "@/features/messages/messages";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { TextToSpeechApiType } from "./types";
import { avatars, backgroundImages } from "./constants";
import { UserInfo } from "../entities/UserInfo";
import { Viewer } from "../features/vrmViewer/viewer";

// チャットログのアトム
export const chatLogAtom = atom<Message[]>([]);
// キャラクターが喋っているかどうかのアトム
export const isCharactorSpeakingAtom = atom<boolean>(false);
// 翻訳モードがONかどうかのアトム
export const isTranslatedAtom = atom<boolean>(false);
// ユーザーIDのアトム
export const userIdAtom = atom<string>("");
// ユーザー情報のアトム
export const userInfoAtom = atom<UserInfo | null>(null);
// 最初の挨拶が終わったかどうかのアトム
export const firstGreetingDoneAtom = atom<boolean>(false);
// viewerのアトム
export const viewerAtom = atom<Viewer | null>(null);

/* 
  Web Storageに保存するアトム
*/
// 表示するアバターのパスのアトム
export const avatarPathAtom = atomWithStorage<string>(
  "avatar",
  avatars[0].path
);
// 表示する背景画像のパスのアトム
export const backgroundImagePathAtom = atomWithStorage<string>(
  "backgroundImagePath",
  backgroundImages[0].path
);
// テキスト読み上げAPIの種類のアトム
export const textToSpeechApiTypeAtom = atomWithStorage<TextToSpeechApiType>(
  "textToSpeechApiType",
  "clovaVoice"
);
// ボタンの使い方を説明したかどうかのアトム
export const isButtonUsageExplainedAtom = atomWithStorage<boolean>(
  "isButtonUsageExplained",
  false
);
