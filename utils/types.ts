// 複数の箇所で使用する型やインターフェースを定義

export type FortuneTellingType = "OVERVIEW" | "SUCCESS" | "TALENT" | "DEPRESSED" | "VOCATION" | "TODAY";
export type FortuneTellingLabel = "あなたの本質" | "あなたの成功方法" | "あなたの才能" | "落ち込んだ時の対処法" | "あなたの適職" | "今日のアドバイス" 

export interface PidResponse {
    answer: string;
    content_code: string;
    item: string;
    key: string;
    result: string;
    voiceText: string;
}

export type UserStatusType = 'free' | 'standard' | 'premium'

export type Sex = 'M' | 'F';

export type SelectedLanguageType = 'English' | '中文';
