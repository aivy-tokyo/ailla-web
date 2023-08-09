import { Message } from "../messages/messages";
import { MAX_TOKENS } from "../constants/systemPromptConstants";


export const removeEmotionTag = (text: string) => {
	const regex = /\[(neutral|happy|angry|sad|relaxed)\]/g;
	return text.replace(regex, '');
}

export const getBirthdayFromComment = (comment: string) => {
  // 正規表現でyyyy/mm/dd, yyyy年mm月dd日, yyyymmdd, yyyy-mm-dd形式を検索
  const regexes = [
    /\d{4}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])/,
    /\d{4}(\/|-)(0[1-9]|1[0-2])(\/|-)(0[1-9]|[12][0-9]|3[01])/,
    /\d{4}年(0[1-9]|1[0-2])月(0[1-9]|[12][0-9]|3[01])日/,
  ];

  let dateString;

  for (const regex of regexes) {
    const match = comment?.match(regex);
    if(!match){
      continue;
    }
    if (match) {
      dateString = match[0];
      // yyyy年mm月dd日形式の場合は/に変換
      if (dateString.includes('年')) {
        dateString = dateString.replace('年', '/').replace('月', '/').replace('日', '');
      }
      // スラッシュやハイフンが存在する場合は削除
      dateString = dateString.replace(/\/|-/g, '');
      // yyyy-mm-dd形式にフォーマット
      const formattedDate = `${dateString.slice(0, 4)}-${dateString.slice(4, 6)}-${dateString.slice(6, 8)}`;
      return formattedDate;
    }
  }

  console.log('birthday is null');
  // マッチするものが見つからなかった場合はnullを返す
  return null;
}


export const responseTextByGpt = async (text: string, PROMPT: string, max_tokens: number = MAX_TOKENS) => {
	const messages:Message[] = [
		{role: 'system', content: PROMPT},
		{role: 'user', content: text},
	];
	const res = await fetch('https://api.openai.com/v1/chat/completions', {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPEN_AI_API_KEY}`,
		},
		method: "POST",
		body: JSON.stringify({
			model: 'gpt-3.5-turbo',
			messages: messages,
			max_tokens: max_tokens,
		})
	});
	const data = await res.json();
	return removeEmotionTag(data?.choices[0]?.message?.content);
}

export async function getChatResponseStream(
  messages: Message[],
  apiKey: string,
  max_tokens: number = MAX_TOKENS,
) {
  if (!apiKey) {
    throw new Error("Invalid API Key");
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    headers: headers,
    method: "POST",
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: messages,
      stream: true,
      max_tokens: max_tokens,
    }),
  });

  const reader = res.body?.getReader();
  if (res.status !== 200 || !reader) {
    throw new Error("Something went wrong");
  }

  const stream = new ReadableStream({
    async start(controller: ReadableStreamDefaultController) {
      const decoder = new TextDecoder("utf-8");
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const data = decoder.decode(value);
          const chunks = data
            .split("data:")
            .filter((val) => !!val && val.trim() !== "[DONE]");
          for (const chunk of chunks) {
            const json = JSON.parse(chunk);
            const messagePiece = json.choices[0].delta.content;
            if (!!messagePiece) {
              controller.enqueue(messagePiece);
            }
          }
        }
      } catch (error) {
        controller.error(error);
      } finally {
        reader.releaseLock();
        controller.close();
      }
    },
  });

  return stream;
}