// import { DEFAULT_PARAM, KoeiroParam } from "@/features/constants/koeiroParam";
// import { SYSTEM_PROMPT } from "@/features/constants/systemPromptConstants";
import { Message } from "@/features/messages/messages";
import exp from "constants";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { FortuneTellingLabel, FortuneTellingType, UserStatusType } from "./types";
import { avatars, backgroundImages } from "./constants";
// import { Prompt } from "@prisma/client";
// import { User } from "@line/bot-sdk";

export const isYoutubeModeAtom = atomWithStorage<boolean>('isYoutubeMode',false);
// export const systemPromptAtom = atom<string>(SYSTEM_PROMPT);
export const chatProcessingAtom = atom<boolean>(false);

// export const koeiroParamAtom = atom<KoeiroParam>(DEFAULT_PARAM);
export const chatLogAtom = atom<Message[]>([]);
export const assistantMessageAtom = atom<string>("");

export const userMessageAtom = atom<string>("");
export const chatCommentsAtom = atom<string[]>([]);
export const responsedLiveCommentsAtom = atom<string[]>([]);

export const commentIndexAtom = atom<number>(0);

export const liveChatIdAtom = atom<string>("");
export const youtubeVideoIdAtom = atomWithStorage<string>('YoutubeVideoId',"");

export const nextPageTokenAtom = atomWithStorage<string>('nextPageToken','');
export const ngwordsAtom = atom<string[]>([]);

export const isFortuneTellingModeAtom = atomWithStorage<boolean>('isFortuneTellingMode',false);

export const fortuneTellingLabelAtom = atom<FortuneTellingLabel | undefined>(undefined);
export const fortuneTellingTypeAtom = atomWithStorage<FortuneTellingType | undefined>('fortuneTellingType',undefined);
export const isFortuneTellingProcessingAtom = atom<boolean>(false);
export const totalResponseCountOfFortuneTellingAtom = atomWithStorage<number>('totalResponseCountOfFortuneTelling',0);

export const aiResponseTextAtom = atom<string>("");
export const isThinkingAtom = atom<boolean>(false);
export const isAiTalkingAtom = atom<boolean>(false);

export const commentOwnerAtom = atom<string>("");
export const commentOwnerIconUrlAtom = atom<string>('');

export const userStatusAtom = atomWithStorage<UserStatusType>('userStatus','free');
export const userNameAtom = atomWithStorage<string>('userName','');

export const userLevelAtom = atomWithStorage<number | string>('userLevel', 0);

export const isTranslatedAtom = atom<boolean>(false);

export const avatarPathAtom = atomWithStorage<string>('avatar',avatars[0].path);
export const backgroundImagePathAtom = atomWithStorage<string> ('backgroundImagePath',backgroundImages[0].path);

export const userIdAtom = atomWithStorage<string>('userId', '');