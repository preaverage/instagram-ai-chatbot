import OpenAI from "openai";
import { IgApiClientRealtime } from "instagram_mqtt";

import sendMessage from "./sendMessage";
import { getResponse } from "../openai";
import { loadData, saveData } from "../../util";

interface GetAndSendProps {
  client: IgApiClientRealtime;
  thread: string;
  allMessages: string[];
  model: OpenAI.Chat.ChatModel;
}

const getAndSend = async ({ client, thread, allMessages, model }: GetAndSendProps) => {
  let messagesCombined = "";
  for (const message of allMessages) {
    let last = false;
    if (allMessages.indexOf(message) == allMessages.length - 1) last = true;

    messagesCombined += message + (!last ? ", " : "");
  }

  console.log(
    `\nGenerating response for compiled messages: \n${messagesCombined}`
  );

  const { messages } = loadData();
  messages.push({ role: "user", content: messagesCombined });

  const response = await getResponse({ messages: messages, model });
  messages.push({ role: "assistant", content: response });

  console.log(`\nSending response: \n${response}.`);
  await sendMessage({
    client: client,
    thread: thread,
    message: response,
  });

  saveData({ messages: messages, lastTimestamp: new Date().getTime() });

  return true;
};

export default getAndSend;
