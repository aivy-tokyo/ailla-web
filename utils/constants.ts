import { Avatar, BackgroundImage, Prefecture, TextToSpeechApiType } from "./types";

export const TableNames = {
  users: 'AILLA',
  userLogs: 'UserLogs',
} as const;

export const GPT_MODEL="gpt-3.5-turbo";

export const avatars: Avatar[]= [
  {
    label: '響狐リク',
    path: '/vrm/Liqu.vrm',
    ttsEnglish: 'en-US-Standard-H',
    ttsJapanese: 'driko',
  },
  {
    label: '安穏こころ',
    path: '/vrm/Cocoro.vrm',
    ttsEnglish: 'en-GB-Standard-A',
    ttsJapanese: 'dtomoko',
  },
  {
    label: '九条フレカ私服',
    path: '/vrm/Fureka_shifuku.vrm',
    ttsEnglish: 'en-GB-Standard-A',
    ttsJapanese: 'dmio'
  },
  {
    label: 'URARA',
    path: '/vrm/AvatarSample_A2.vrm',
    ttsEnglish: 'en-US-Standard-F',
    ttsJapanese: 'dtomoko',
  },
  {
    label: 'URARA_BOY',
    path: '/vrm/URARA_BOY.vrm',
    ttsEnglish:'en-US-Standard-J',
    ttsJapanese: 'ddaiki'
  },
  {
    label: 'URARA_BOY_Hoodie',
    path: '/vrm/URARA_BOY_Hoodie.vrm',
    ttsEnglish:'en-US-Standard-J',
    ttsJapanese: 'ddaiki'
  },
  {
    label: 'AvatarSample3',
    path: '/vrm/AvatarSample_B.vrm',
    ttsEnglish: 'en-GB-Standard-A',
    ttsJapanese: 'dnaomi_joyful',
  }
];

export const backgroundImages: BackgroundImage[] = [
  {
    label: '部屋',
    path: '/background/room.jpg',
  },
  {
    label: '空',
    path: '/background/sky.jpg',
  },
  {
    label: 'チェックインカウンター',
    path: '/background/checkin.jpg',
  },
  {
    label: '背景1',
    path: 'uraraBackground.gif',
  },
  {
    label: '背景2',
    path: 'sample01.gif',
  },
  {
    label: '背景3',
    path: 'sample02.gif',
  },
  {
    label: '背景4',
    path: 'sample03.gif',
  },
];

export const prefectures: Prefecture[] = [
  '北海道', '青森県', '岩手県', '宮城県', 
  '秋田県', '山形県', '福島県', '茨城県', 
  '栃木県', '群馬県', '埼玉県', '千葉県', 
  '東京都', '神奈川県', '新潟県', '富山県', 
  '石川県', '福井県', '山梨県', '長野県', 
  '岐阜県', '静岡県', '愛知県', '三重県', 
  '滋賀県', '京都府', '大阪府', '兵庫県', 
  '奈良県', '和歌山県', '鳥取県', '島根県', 
  '岡山県', '広島県', '山口県', '徳島県', 
  '香川県', '愛媛県', '高知県', '福岡県', 
  '佐賀県', '長崎県', '熊本県', '大分県', 
  '宮崎県', '鹿児島県', '沖縄県'
];

interface TextToSpeechApi {
  label: string,
  value: TextToSpeechApiType,
};

export const textToSpeechApiTypeList: TextToSpeechApi[] = [
  // {
  //   label: 'koeiro map',
  //   value: 'koeiroMap'
  // },
  // {
  //   label: 'VOICEVOX',
  //   value: 'voiceVox'
  // },
  {
    label: 'CLOVA Voice',
    value: 'clovaVoice'
  },
  {
    label: 'Google/Text-to-Speech Ai',
    value: 'googleTextToSpeech'
  },
];