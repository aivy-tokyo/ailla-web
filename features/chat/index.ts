import { ChatCompletionFunctions, ChatCompletionRequestMessage, Configuration, CreateChatCompletionRequest, OpenAIApi } from "openai";

type Props = {
  messages: ChatCompletionRequestMessage[];
  userId?: string;
  functions?: ChatCompletionFunctions[];
};
export const chat = async ({
  messages,
  functions,
  userId,
}: Props) => {
  if (process.env.OPENAI_API_KEY === undefined) {
    throw new Error("OPENAI_API_KEY is not defined");
  }

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  const createChatCompletionRequest: CreateChatCompletionRequest = {
    model: "gpt-3.5-turbo",
    messages: messages,
    temperature: 1,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  };
  if (functions) {
    createChatCompletionRequest['function_call'] = 'auto';
    createChatCompletionRequest['functions'] = functions;
  }
  if (userId) {
    createChatCompletionRequest['user'] = userId;
  }

  const response = await openai.createChatCompletion(createChatCompletionRequest);

  return response.data;
};
