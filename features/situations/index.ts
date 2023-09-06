/**
 * シチュエーションの型定義
 * シチュエーションは、タイトル、説明、ステップからなる
 * ステップは、キーワード、説明、ヒントからなる
 * シチュエーションのタイトル、説明はAIへのシーン設定のプロンプトに使用される
 * ステップのキーワードで会話の流れを制御する
 * ステップの説明とヒントは、ユーザーに表示される
 */
export type Situation = {
  title: string; // シチュエーションのタイトル
  description: string; // シチュエーションの説明
  roleOfAi: string; // AIの役割
  roleOfUser: string; // ユーザーの役割
  steps: {
    // シチュエーションのステップ
    keySentences: string[]; // キーワード
    description: string; // ステップの説明
    hint: string; // ヒント
  }[];
};

export const situationCheckIn: Situation = {
  title: "Check-in",
  description: "ホテルのフロントでチェックインするシーンです。",
  roleOfAi: "Customer",
  roleOfUser: "Staff",
  steps: [
    {
      keySentences: ["reservation", "name"],
      description: "まずは名前を確認しよう",
      hint: "May I have your reservation name, please?",
    },
    {
      keySentences: ["type", "room"],
      description: "次に部屋のタイプを確認しよう",
      hint: "What type of room did you book?",
    },
    {
      keySentences: ["passport", "identification"],
      description: "次に身分証明書を確認しよう",
      hint: "For check-in, we require either a passport or identification card. Do you have it with you?",
    },
    {
      keySentences: ["payment"],
      description: "次に支払い方法を確認しよう",
      hint: "How would you like to settle the payment?",
    },
    {
      keySentences: ["room", "number"],
      description: "最後に部屋番号を伝えよう",
      hint: "Your room number is 1234. The elevator is over there.",
    },
  ],
};

export const situantionCheckIn2: Situation = {
  title: "Check-in",
  description: "ホテルのフロントでチェックインするシーンです。宿泊代の前払いが必要な場合です。",
  roleOfAi: "Customer",
  roleOfUser: "Staff",
  steps: [
    {
      keySentences: ["reservation", "name"],
      description: "まずは名前を確認しよう",
      hint: "May I have your reservation name, please?",
    },
    {
      keySentences: ["correct","room", "nights"],
      description: "予約内容を確認しよう",
      hint: "You have booked a <room type> for <number of nights> nights. Is that correct?",
    },
    {
      keySentences: ["identification"],
      description: "次に身分証明書を確認しよう",
      hint: "Before we proceed with the check-in process, could I kindly ask you to provide a form of identification, such as a passport or driver's license?"
    },
    {
      keySentences: ["payment"],
      description: "次に支払い方法を確認しよう",
      hint: "How would you like to settle the payment? We accept both cash and credit cards",
    },
    //MEMO: クレジットカード支払いの場合、参考ドキュメントでは フォームにカード情報と署名を記入させているが、近年はカードリーダーを使うかと思うので、別の文言に変更が必要な気がする。
    {
      keySentences:["room"],
      description: "部屋番号や宿泊中の注意事項を伝えよう",
      hint: "I've processed your payment, and everything is in order. Now, let's proceed with the check-in formalities. Here is your room key. You'll be staying in room 306 on the third floor. Breakfast is served from 7 am to 10 am in the hotel restaurant, and the Wi-Fi password is 'guest123'. If you have any questions or need assistance during your stay, please don't hesitate to contact our front desk. Enjoy your stay with us!",
    },
  ],
};

export const situationReserveRestaurant: Situation = {
  title: "Reserve Restaurant ",
  description: "今夜のレストランディナーを予約するシーンです。",
  roleOfAi: "Customer",
  roleOfUser: "Staff",
  steps: [
    {
      keySentences: ["reservation", "name"],
      description: "まずは名前を確認しよう",
      hint: "May I have your name, please?",
    },
    {
      keySentences: ["How", "many", "people"],
      description: "次に人数を確認しよう",
      hint: "How many people will be in your party?",
    },
    {
      keySentences: ["what","time"],
      description: "次に時間を確認しよう",
      hint: "What time would you prefer for your reservation?",
    },
    {
      keySentences: ["booked", "availablity"],
      description: "予約枠が埋まっている場合、他の時間を提案しよう",
      hint: "I'm sorry, but that time is fully booked. However, we do have availability at 7:00 p.m. or 8:00 p.m. Which one would you prefer?",
    },
    {
      keySentences: ["confirm", "reservation"],
      description: "記念日や食事の制限について確認しよう",
      hint: "Is there any special occasion or dietary restrictions we should be aware of?",
    },
    {
      keySentences: ["phone", "number"],
      description: "連絡先を確認しよう",
      hint: "Is there a phone number where we can reach you if needed?",
    },
    {
      keySentences: ["confirm", "reservation"],
      description: "最後に予約を確認しよう",
      hint: "Thank you for your reservation.  We have your reservation for tonight at <reserved time>",
    }
  ],
};

export const situationCancellationOfRestaurantReservation: Situation = {
  title: "Cancellation of Restaurant Reservation",
  description: "今夜のレストランディナーの予約をキャンセルするシーンです。",
  roleOfAi: "Customer",
  roleOfUser: "Staff",
  steps: [
    {
      keySentences: ["reservation", "name"],
      description: "まずは名前と予約内容を確認しよう",
      hint: "I'm sorry to hear that. May I have your name and reservation details, please?",
    },
    {
      keySentences: ["reason"],
      description: "キャンセルの理由を確認しよう",
      hint: "I have located your reservation. I'm sorry to hear that you need to cancel. May I ask the reason for the cancellation?",
    },
    {
      keySentences: ["contact"],
      description: "連絡先を確認しよう",
      hint: "Is there a preferred method of contact in case we need to reach you in the future?"
    },
    {
      keySentences: ["confirm", "cancellation"],
      description: "最後にキャンセルが完了したことを伝えよう",
      hint: "I have canceled your reservation for tonight at <resevation time>. We appreciate you letting us know in advance. Should your plans change in the future, please don't hesitate to reach out to us."
    }
  ],
};

// export const situationCheckIn3: Situation = {
//   title: "Check-in",
//   description: "ホテルのフロントでチェックインするシーンです。予約内容(禁煙の部屋)と違う部屋(喫煙可の部屋)を割り当ててしまい、顧客への謝罪と緊急の対応が必要な場合です。",
//   roleOfAi: "Customer",
//   roleOfUser: "Staff",
//   steps: [
//     {
//       keySentences: ["name", "reservation"],
//       description: "まずは謝罪し,名前と予約内容の詳細を確認しよう",
//       hint: "I apologize for any inconvenience. Could you please provide me with your name and reservation details?",
//     },
//     {
//       keySentences: [],
//       description: ""
//     }
//   ],
// };

export const situationCheckOut: Situation = {
  title: "Check-out",
  description: "ホテルのフロントでチェックアウトするシーンです。",
  roleOfAi: "Customer",
  roleOfUser: "Staff",
  steps: [
    {
      keySentences: ["room", "number"],
      description: "まずは部屋番号を確認しよう",
      hint: "May I have your room number, please?",
    },
    {
      keySentences: ["outstanding", "charges"],
      description: "次に未払いの料金の請求を確認しよう",
      hint: "Could you please settle any outstanding charges? I see that you have breakfast charges and a minibar bill.",
    },
    {
      keySentences: ["payment", "successful"],
      description: "支払いが完了したことを伝えよう",
      hint: "Thank you for your patience. Your payment has been successfully processed. Here's your receipt. Is there anything else we can assist you with?",
    },
    {
      keySentences: ["feedback"],
      description: "感謝を伝え、フィードバックを求めよう",
      hint: "It was a pleasure having you as our guest, Mr. Smith. We hope you enjoyed your stay. If you have any feedback or suggestions, please feel free to let us know. We wish you a safe journey home!",
    },
  ],
};

export const situationCheckOut2: Situation = {
  title: "Check-out2",
  description: "ホテルのフロントでチェックアウトするシーンです。お客様から滞在中の不満が表明される場合です。(不満の内容:①エアコンの不具合、②シャワーの排水溝が詰まっていた、③工事の騒音)",
  roleOfAi: "Customer",
  roleOfUser: "Staff",
  steps: [
    {
      keySentences: ["inconvenience"],
      description: "まずは謝罪し,不満の内容を確認しよう",
      hint: "I apologize for any inconvenience. Please let me know what the problem is, and I'll do my best to assist you.",
    },
    {
      keySentences: ["action"],
      description: "不満点について再び謝罪し、今後の改善を約束する",
      hint: "I'm sorry to hear that. I assure you that we will take immediate action to address these matters. Is there anything else I can assist you with?",
    },
  ],
};

export const situationAskedForMenuRecommendation: Situation = {
  title: "Asked for a Menu Recommendation",
  description: "居酒屋でメニューのおすすめを聞かれた時の会話です。",
  roleOfAi: "Customer",
  roleOfUser: "Staff",
  steps: [
    {
      keySentences: ["recommend"],
      description: "まずはおすすめのメニューを伝えよう",
      hint: "We have several delicious dishes that I can recommend. Our most popular dish is the 'Tori Karaage', which is crispy fried chicken served with a tangy dipping sauce. It's a favorite among our customers.",
    },
    {
      keySentences: ["another"],
      description: "他のメニューを提案しよう",
      hint: "Another popular option is our 'Gyoza' which are savory pan-fried dumplings filled with juicy meat and vegetables. They're a perfect choice for appetizers."
    },
    {
      keySentences: ["recommend","seafood"],
      description: "お客様が海鮮が好きな場合、海鮮料理を提案しよう",
      hint: "For seafood lovers, I highly recommend our 'Sashimi Moriawase', which is a platter of assorted fresh sashimi, including tuna, salmon, and octopus. It's a refreshing and delicate dish."
    },
    {
      keySentences: ["recommend","vegetable"],
      description: "お客様にベジタリアンがいる場合、野菜料理を提案しよう",
      hint: "We have a delicious vegetable tempura that's light and crispy. It's a medley of seasonal vegetables, including sweet potatoes, green beans, and eggplant, deep-fried to perfection."
    },
    {
      keySentences: ["recommend","cocktail"],
      description: "お客様がカクテルが好きな場合、カクテルを提案しよう",
      hint: "Our specialty cocktail is called the 'Yuzu Sour'. It's a refreshing blend of yuzu citrus juice, shochu, and a hint of sweetness. It pairs perfectly with the flavors of our dishes.",
    }
  ],
};