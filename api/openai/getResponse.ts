import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type getResponseProps = {
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[];
  model: OpenAI.Chat.ChatModel;
}

const getResponse = async ({ messages, model }: getResponseProps) => {
  const response = await openai.chat.completions.create({
    messages: messages,
    model: model,
  });

  return response.choices[0].message.content;
};

export default getResponse;
