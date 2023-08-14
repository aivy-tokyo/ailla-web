import { Avatar, BackgroundImage, Prefecture, TextToSpeechApiType } from "./types";

export const avatars: Avatar[]= [
  {
    label: 'URARA',
    path: '/AvatarSample_A2.vrm'
  },
  {
    label: 'AvatarSample2',
    path: '/AvatarSample_A.vrm',
  },
  {
    label: 'AvatarSample3',
    path: 'AvatarSample_B.vrm'
  }
];

export const backgroundImages: BackgroundImage[] = [
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
  {
    label: 'koeiro map',
    value: 'koeiroMap'
  },
  {
    label: 'VOICEVOX',
    value: 'voiceVox'
  },
  {
    label: 'CLOVA Voice',
    value: 'clovaVoice'
  },
  {
    label: 'Google/Text-to-Speech Ai',
    value: 'googleTextToSpeech'
  },
];