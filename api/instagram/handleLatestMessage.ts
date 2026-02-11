import { Thread } from "../../types";
import { IgApiClientRealtime, MessageSyncMessageWrapper } from "instagram_mqtt";

interface HandleLatestMessageProps {
  client: IgApiClientRealtime;
  message: MessageSyncMessageWrapper;
  collectedThreads: Thread[];
  threads: string[];
}

const handleLatestMessage = async ({
  client,
  message,
  collectedThreads,
  threads,
}: HandleLatestMessageProps) => {
  if (threads) {
    const isWhiteListed = threads.find(thread => thread === message.message.thread_id);
    if (!isWhiteListed) return null;
  }

  if (message.message.item_type !== "text" || message.message.text.length < 2)
    return null;

  const currentTime = new Date().getTime();
  const messageTimestamp =
    parseInt(message.message.timestamp.toString()) / 1000;

  if ((currentTime - messageTimestamp) / 1000 >= 20) {
    return null;
  }

  const { username: fromuser } =
    await client.user.info(message.message.user_id.toString());
  if (fromuser == process.env.IG_username) return null;

  const messageText = `From ${fromuser}: ${message.message.text}`;

  let messageLength = 0;
  let alreadyCollected = collectedThreads.find(
    (thread) => thread.id === message.message.thread_id
  );

  if (alreadyCollected) {
    alreadyCollected.messages.push(messageText);
    messageLength = alreadyCollected.messages.length;
  }

  if (!alreadyCollected) {
    const thread = {
      id: message.message.thread_id,
      messages: [messageText],
    };

    collectedThreads.push(thread);
    messageLength = thread.messages.length;
  }

  console.log(`Recieved ${messageLength} message(s).`);
  return collectedThreads;
};

export default handleLatestMessage;
