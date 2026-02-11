import "dotenv/config";
import * as fs from "fs";

import { Thread } from "./types";
import { clientHandle, getConfig, intervalChecks, sleep } from "./util";
import { login, getAndSend, handleLatestMessage } from "./api/instagram";

const client = clientHandle(() => login({ client }));

const main = async () => {
  const config = getConfig();

  intervalChecks({ prompt: config.prompt });

  let isLogin: string;
  try {
    isLogin = fs.readFileSync("./login.json", "utf-8");
  } catch {
    fs.writeFileSync("./login.json", "");
  }

  if (!isLogin) {
    await login({ client }).catch(() => {});
  }

  if (isLogin) {
    await client.state.deserialize(JSON.parse(isLogin));
  }

  console.log(`Watching for messages. (${config.waitTime} seconds)`);

  let collectedThreads: Thread[] = [];
  client.realtime.on("message", async (message) => {
    const newThreads = await handleLatestMessage({
      client,
      message,
      collectedThreads,
      threads: config.threads,
    });

    if (newThreads) collectedThreads = newThreads;
  });

  await client.realtime.connect({
    irisData: await client.feed.directInbox().request(),
  });

  while (true) {
    if (collectedThreads.length <= 0) continue;

    for (const thread of collectedThreads) {
      collectedThreads =
        collectedThreads.filter(item => item.id !== thread.id);

      await getAndSend({
        client,
        thread: thread.id,
        allMessages: thread.messages,
        model: config.model,
      });

      console.log(`\nWatching for messages. (${config.waitTime} seconds)`);
    };

    await sleep({ seconds: config.waitTime });
  }
};

main();
