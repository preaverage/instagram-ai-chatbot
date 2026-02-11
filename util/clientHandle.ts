import { IgApiClient } from "instagram-private-api";
import { withRealtime } from "instagram_mqtt";

import * as fs from "fs";
import saveData from "./saveData";

const clientHandle = (callback: () => void) => {
  saveData({
    messages: [],
    lastTimestamp: null,
  });

  const client = withRealtime(new IgApiClient());

  client.request.end$.subscribe(async () => {
    const serialized = await client.state.serialize();
    delete serialized.constants;

    fs.writeFileSync("./login.json", JSON.stringify(serialized));
  });

  client.request.error$.subscribe(async (error) => {
    if (error.name == "IgCheckpointError") {
      console.log("Challange required, quitting.");
      return process.exit();
    }

    fs.writeFileSync("./login.json", "");

    callback();
  });

  return client;
};

export default clientHandle;
