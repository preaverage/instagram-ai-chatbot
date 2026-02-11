import { IgApiClient } from "instagram-private-api";

interface SendMessageProps {
  client: IgApiClient;
  thread: string;
  message: string;
}

const sendMessage = async ({ client, thread, message }: SendMessageProps) => {
  const group = client.entity.directThread(thread);
  await group.broadcastText(message).then(() => {});
};

export default sendMessage;
