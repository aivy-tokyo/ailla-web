import { Message } from "@/features/messages/messages";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { Avatar } from "./types";
import { avatars, backgroundImages } from "./constants";
import { UserInfo } from "@/entities/UserInfo";
import { ClientInfo } from "@/entities/ClientInfo";
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

// Client言語情報のアトム
export const clientLanguageAtom = atom<string>("");

// 最初の挨拶が終わったかどうかのアトム
export const firstGreetingDoneAtom = atom<boolean>(false);
// viewerのアトム
export const viewerAtom = atom<Viewer | null>(null);
// 音声入力の許可を得たかどうかのアトム
export const isVoiceInputAllowedAtom = atom<boolean>(false);

/* 
  Web Storageに保存するアトム
*/
// Client情報のアトム
export const clientInfoAtom = atomWithStorage<ClientInfo | null>("clientInfo", null);

// 表示するアバターのパスのアトム
export const avatarPathAtom = atomWithStorage<string>(
  "avatar",
  avatars[0].path
);

// 表示するアバターのアトム
export const currentAvatarAtom = atomWithStorage<Avatar>(
  "currentAvatar",
  avatars[0]
);

// 表示する背景画像のパスのアトム
export const backgroundImagePathAtom = atomWithStorage<string>(
  "backgroundImagePath",
  backgroundImages[0].path
);
// ボタンの使い方を説明したかどうかのアトム
export const isButtonUsageExplainedAtom = atomWithStorage<boolean>(
  "isButtonUsageExplained",
  false
);
