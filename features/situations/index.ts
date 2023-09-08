/**
 * シチュエーションの型定義
 * シチュエーションは、タイトル、説明、ステップからなる
 * ステップは、キーワード、説明、ヒントからなる
 * シチュエーションのタイトル、説明はAIへのシーン設定のプロンプトに使用される
 * ステップのキーワードで会話の流れを制御する
 * ステップの説明とヒントは、ユーザーに表示される
 */
export type SituationStep = {
  // シチュエーションのステップ
  keySentences: string[]; // キーワード
  description: string; // ステップの説明
  hint: string; // ヒント
} | {
  keyPhrases: string[]; // キーワード
  description: string; // ステップの説明
  hint: string; // ヒント
}

export type Situation = {
  title: string; // シチュエーションのタイトル
  description: string; // シチュエーションの説明
  roleOfAi: string; // AIの役割
  roleOfUser: string; // ユーザーの役割
  steps: SituationStep[];
};

export const situationCheckIn: Situation = {
  title: "Check in",
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
    {
      keyPhrases: [
        "Have a safe trip home",
        "Thank you for staying with us."
      ],
      description: "最後の挨拶をしよう",
      hint: "Have a safe trip home. Thank you for staying with us."
    }
  ],
};

export const situantionCheckIn2: Situation = {
  title: "Check in 2",
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
  title: "Check out",
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
  title: "Check out 2",
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
  description: "居酒屋でメニューのおすすめを聞かれた時の会話です。おすすめのメニューが２回聞かれます。そのあと、海鮮系メニューのおすすめを一品、ベジタリアン向けのおすすめを一品、おすすめのカクテル(甘いお酒)が聞かれます。",
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

export const situationAskedForMenuRecommendation2 : Situation = {
  title: "Asked for a Menu Recommendation",
  description: "お寿司屋さんでメニューのおすすめを聞かれた時の会話です。まずメニュー全般の中からおすすめを聞かれます。その次に特定のお魚やネタの中からおすすめを聞かれます。さらに他のおすすめが１回聞かれます。その後にベジタリアン向けのメニューについて聞かれます。その後にお寿司に合う飲み物について聞かれます。",
  roleOfAi: "Customer",
  roleOfUser: "Staff",
  steps: [
    {
      keySentences: ["recommend"],
      description: "まずはおすすめのメニューを伝えよう",
      hint: "We have several delicious options for you to try. Today, our recommended sushi is the 'Omakase' course, where I'll personally select the freshest and most seasonal fish for you.",
    },
    {
      keySentences: ["recommend"],
      description: "特定の魚でおすすめを聞かれた場合、おすすめの魚を伝えよう",
      hint: "Today, we have some exquisite fish available. I recommend starting with the 'Maguro' (tuna), which has a rich and buttery flavor. We also have 'Hamachi' (yellowtail) that melts in your mouth with its delicate texture."
    },
    {
      keySentences: ["recommend"],
      description: "さらに他のおすすめを聞かれた場合の例",
      hint: "'Uni' (sea urchin) is incredibly fresh and creamy. It's a delicacy you won't want to miss if you enjoy unique flavors. Additionally, our 'Ikura' (salmon roe) sushi bursts with a delightful pop of flavor in every bite."
    },
    {
      keySentences: ["vegetable"],
      description: "ベジタリアンのお客様向けのメニューを提案しよう",
      hint: "We have a delicious 'Kappa Maki' (cucumber roll) that's refreshing and crisp. We also have an assortment of vegetable nigiri, such as 'Inari' (sweet tofu pouch) and 'Tamago' (sweet rolled omelet), which are both traditional and flavorful choices."
    },
    {
      keySentences: ["drink"],
      description: "お寿司に合う飲み物を提案しよう",
      hint: "We offer a variety of traditional Japanese drinks, including sake and green tea, which pair wonderfully with sushi. If you're looking for a unique experience, I recommend trying our 'Sake Flight', where you can sample different types of sake and discover your favorite."
    },
    {
      keySentences: ["dietary"],
      description: "食べられない食材がないか聞いておこう",
      hint: "Is there anything else I can help you with or any dietary restrictions I should be aware of?"
    },
  ],
};

//クレジットカードでお会計をする時
  export const situationPaymentWithCreditCard: Situation = {
  title: "Payment",
  description: "飲食店でお会計をするシーンです。顧客はクレジットカードでの支払いを希望します。",
  roleOfAi: "Customer",
  roleOfUser: "Staff",
  steps: [
    {
      keySentences: ["bill"],
      description: "まずは伝票を渡し、中身を確認してもらおう",
      hint: "Here is your bill. Please take your time to review it.",
    },
    {
      keySentences: ["payment"],
      description: "次に支払い方法を確認しよう",
      hint: "How would you like to settle the payment?",
    },
    {
      keySentences: ["card"],
      description: "クレジットカードで支払う場合、カードを渡してもらおう",
      hint: "May I have your credit card, please?",
    },
    {
      keySentences: ["success"],
      description: "支払いが完了したことを伝え、レシートを渡そう",
      hint: "Your payment has been successfully processed. Here is your receipt. Is there anything else I can assist you with?",
    },
  ],
};

export const situationPaymentWithCash: Situation = {
  title: "Payment2",
  description: "飲食店でお会計をするシーンです。顧客は現金での支払いを希望します。",
  roleOfAi: "Customer",
  roleOfUser: "Staff",
  steps: [
    {
      keySentences: ["bill"],
      description: "まずは伝票を渡し、中身を確認してもらおう",
      hint: "Here is your bill. Please take your time to review it.",
    },
    {
      keySentences: ["payment"],
      description: "次に支払い方法を確認しよう",
      hint: "How would you like to settle the payment?",
    },
    {
      keySentences: ["change"],
      description: "お釣りが必要な場合、お釣りとレシートを渡そう",
      hint: "Here is your change and receipt. Is there anything else I can assist you with?",
    },
  ],
};


export const situationCheckInAtTheAirport: Situation = {
  title: "Check-in at the Airport",
  description: "空港でチェックインするシーンです。",
  roleOfAi: "Passenger",
  roleOfUser: "JAL Staff",
  steps: [
    {
      keySentences: ["passport", "ticket"],
      description: "まずはパスポートとチケットを確認しよう",
      hint: "May I have your passport and flight ticket, please?",
    },
    {
      keySentences: ["baggage"],
      description: "予約の確認・チェックイン手続きを開始する旨を伝え、荷物の確認をさせてもらおう",
      hint: "Thank you. I'll check your reservation and get you checked in. Could you also provide me with your baggage?",
    },
    {
      keySentences: ["weight","size"],
      description: "機内持ち込み荷物についての注意事項を伝えよう",
      hint: "I see that you have one checked bag. I'll tag it for you. Please make sure to keep your carry-on within the allowed size and weight limits.",
    },
    {
      keySentences: ["boarding", "pass"],
      description: "搭乗券を渡し、搭乗ゲートについて伝えよう",
      hint: "Now, let me print your boarding pass. Here you go. Your seat is 23A. The gate for your flight is B6. Boarding will begin approximately 30 minutes before departure.",
    },
    {
      keySentences: ["security", "check"],
      description: "セキュリティチェックの注意事項について伝えよう",
      hint: "please be aware of the security procedures at the airport. Make sure to have your boarding pass and passport readily available during the security check.",
    },
    {
      keySentences: ["flight"],
      description: "最後の挨拶をしよう",
      hint: "If you have any further questions or need any assistance, please don't hesitate to ask. Enjoy your flight!"
    }
  ],
};

export const situationCheckInAtTheAirport2: Situation = {
  title: "Check-in at the Airport2",
  description: "空港でチェックインするシーンです。顧客の預け荷物が重量制限を超えていた場合の会話です。顧客は超過料金を払うだけの現金を持ち合わせていません。預け荷物から手荷物へ、所持品を移動させる選択肢を選ぶことになります。",
  roleOfAi: "Passenger",
  roleOfUser: "JAL Staff",
  steps: [
    {
      keySentences: ["passport", "ticket"],
      description: "まずはパスポートとチケットを確認しよう",
      hint: "May I have your passport and flight ticket, please?",
    },
    {
      keySentences: ["baggage"],
      description: "予約の確認・チェックイン手続きを開始する旨を伝え、荷物の確認をさせてもらおう",
      hint: "Thank you. I'll check your reservation and get you checked in. Could you also provide me with your baggage?",
    },
    {
      keySentences: ["overweight"],
      description: "荷物が重量制限を超えていることを伝えよう",
      hint: "I'm sorry, but your baggage is overweight. It exceeds the allowed limit by 5 kilograms.",
    },
    {
      keySentences: ["excess", "fee"],
      description: "超過料金について伝えよう",
      hint: "Let me explain the options to you. We do have an excess baggage fee for overweight bags. The fee for the extra 5 kilograms would be ¥10,000. Would you like to proceed with paying the excess baggage fee?"
    },
    {
      keySentences: ["reduce"],
      description: "超過料金を減らす為の提案をしてみよう",
      hint: "We can reduce the excess weight of your bag by transferring some items to your carry-on luggage, as long as it complies with the carry-on size and weight limits."
    },
    {
      keySentences: ["within"],
      description: "制限内に収まったことを伝えよう",
      hint: "Alright, we have reduced the weight of your checked bag. It now falls within the allowed limit." 
    }
  ],
};

// チェックイン3(悪天候でフライトキャンセル)
export const situationCheckInAtTheAirport3: Situation = {
  title: "Check-in at the Airport3",
  description: "空港でチェックインするシーンです。顧客のフライトが悪天候でキャンセルになった場合の会話です。会話は乗客が、最新の運行状況を問い合わせるセリフから始まります。最後に、乗客が感謝の言葉を述べます。",
  roleOfAi: "Passenger",
  roleOfUser: "JAL Staff",
  steps: [
    {
      keySentences: ["flight", "updates"],
      description: "まずは不便をかけている旨を謝罪し、最新の運行状況を伝えよう",
      hint: " I apologize for the inconvenience. Yes, there are severe weather conditions in New York, and the airport is currently closed for departures. As a result, your flight has been delayed indefinitely."
    },
    {
      keySentences: ["arrange", "accommodation"],
      description: "宿泊施設の手配と明日のフライトについて伝えよう",
      hint: "We have arranged accommodation for affected passengers at nearby hotels for one night. You will stay overnight and be transferred to a new flight departing tomorrow to your destination."
    },
    {
      keySentences: [],
      description: "宿泊施設と明日のフライトについての詳細を伝えよう",
      hint: "We have booked you a room at a nearby hotel, which is approximately 15 minutes away from the airport. Our staff will provide transportation to and from the hotel. As for your new flight, we will provide you with the details once the departure time is confirmed, as it depends on the weather conditions in <destination>"
    },
    {
      keySentences: ["voucher"],
      description: "バウチャーの保管について注意を促そう",
      hint: "Upon arrival at the hotel, you will receive a voucher for your stay and meal arrangements. Please keep the voucher and your boarding pass safe, as you will need them for the new flight tomorrow."
    },
    {
      keySentences: [],
      description: "乗客からの感謝の言葉に対して返事をしよう",
      hint: "We're here to help. If you have any questions or need any further information, please don't hesitate to ask. We apologize for the inconvenience caused and appreciate your understanding."
    },
  ],
};

// チェックイン4(悪天候で６時間のフライト遅延)
export const situationCheckInAtTheAirport4: Situation = {
  title: "Check-in at the Airport4",
  description: "空港でチェックインするシーンです。顧客のフライトが悪天候で６時間遅延した場合の会話です。会話は乗客が、最新の運行状況を問い合わせるセリフから始まります。スタッフはバウチャーと待機用エリアを用意し、最後に、乗客が感謝の言葉を述べます。",
  roleOfAi: "Passenger",
  roleOfUser: "JAL Staff",
  steps: [
    {
      keySentences: ["flight", "updates"],
      description: "まずは不便をかけている旨を謝罪し、最新の運行状況を伝えよう",
      hint: "I apologize for the inconvenience. Yes, there are severe weather conditions at your destination, and as a result, your flight has been delayed by approximately 6 hours."
    },
    {
      keySentences: [],
      description: "最新の出発時間について質問された場合、未定なので答えられない旨を伝えよう",
      hint: "Due to the unpredictable nature of the weather, we are unable to provide an exact departure time at the moment. We are continuously monitoring the situation and will keep you updated as soon as we receive further information."
    },
    {
      keySentences: ["voucher"],
      description: "待機中に利用できるバウチャーと専用待機エリアの提供について伝えよう",
      hint: "As a token of our appreciation for your patience, we will provide meal vouchers for use at the airport restaurants. Additionally, we have set up a dedicated waiting area with seating and amenities where you can relax and wait for your flight."
    },
    {
      keySentences: [],
      description: "乗客からの感謝の言葉に対して返事をしよう",
      hint: "You're welcome. If you have any specific needs or require any assistance during the delay, please feel free to let us know. We are here to help and make your wait as comfortable as possible."
    }
  ],
};