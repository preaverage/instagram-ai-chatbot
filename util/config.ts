import OpenAI from "openai";
import config from "../config.json";

const ValidModels: OpenAI.Chat.ChatModel[] = [
  "gpt-3.5-turbo",
  "gpt-4",
  "gpt-4-turbo",
  "gpt-4o",
  "gpt-4o-mini",
] as const;

type ValidModel = typeof ValidModels[number];

type Config = {
  prompt: string;
  threads: string[] | null;
  waitTime: number;
  model: OpenAI.Chat.ChatModel;
};

const configDefaults: Config = {
  prompt: "",
  threads: null,
  waitTime: 15,
  model: "gpt-4o",
};

const isValidModel = (model: string): model is OpenAI.Chat.ChatModel => {
  return ValidModels.includes(model as ValidModel);
}

const getConfig = (): Config => {
  if (!config.prompt) throw new Error("you must specify a prompt");

  const model = config.model || configDefaults.model;
  if (!isValidModel(model)) {
    throw new Error(`Invalid model: ${model}. Must be one of: ${ValidModels.join(", ")}`);
  }

  return {
    prompt: config.prompt,
    threads: config.threads ?? configDefaults.threads,
    waitTime: config.waitTime ?? configDefaults.waitTime,
    model,
  };
};

export default getConfig;