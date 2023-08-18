import { Message } from "@/features/messages/messages";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { TextToSpeechApiType } from "./types";
import { avatars, backgroundImages } from "./constants";
import { DEFAULT_PARAM, KoeiroParam } from "@/features/constants/koeiroParam";
import { UserInfo } from "../entities/UserInfo";
// import { Prompt } from "@prisma/client";
// import { User } from "@line/bot-sdk";

export const chatProcessingAtom = atom<boolean>(false);

export const koeiroParamAtom = atom<KoeiroParam>(DEFAULT_PARAM);
export const chatLogAtom = atom<Message[]>([]);
export const assistantMessageAtom = atom<string>("");

export const userMessageAtom = atom<string>("");
export const chatCommentsAtom = atom<string[]>([]);
export const responsedLiveCommentsAtom = atom<string[]>([]);

export const commentIndexAtom = atom<number>(0);

export const liveChatIdAtom = atom<string>("");

export const aiResponseTextAtom = atom<string>("");
export const isThinkingAtom = atom<boolean>(false);
export const isAiTalkingAtom = atom<boolean>(false);

export const isTranslatedAtom = atom<boolean>(false);

export const avatarPathAtom = atomWithStorage<string>('avatar',avatars[0].path);
export const backgroundImagePathAtom = atomWithStorage<string> ('backgroundImagePath',backgroundImages[0].path);
export const textToSpeechApiTypeAtom = atomWithStorage<TextToSpeechApiType>('textToSpeechApiType','clovaVoice')

export const userIdAtom = atomWithStorage<string>('userId', '');
export const userInfoAtom = atom<UserInfo | null>(null);

export const firstGreetingDoneAtom = atom<boolean>(false);