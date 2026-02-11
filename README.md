# Instagram AI Chatbot

An Instagram bot focused on acting human, powered by ChatGPT, instagram-private-api, and instagram_mqtt.

## Installation

```shell
# clone repository
git clone https://github.com/ayhamtwam/instagram-ai-chatbot.git

# install modules
npm install
```

## Setup

1. Create a `.env` file.

```env
IG_USERNAME=john
IG_PASSWORD=appleseed
OPENAI_API_KEY=OPENAI_API_KEY
```

2. Create a `config.json`.

```json
{
  "prompt": "You are Josh, an adult male. You are in a text conversation with multiple friends. Josh curses often but not a lot, is very sarcastic, and likes to make jokes. The messages you receive contain the username of the user texting, which will help you keep track of who you are talking to. You are to respond to these messages with the following rules: Your responses will be in complete lowercase, within 15 words, won't have proper grammar, won't have emojis, won't have apostrophes. You will NEVER address your friend or yourself.",
  "threads": null,
  "waitTime": 15
}
```

2.5. Set `threads` as an array of strings if you only want to listen to specific threads, ignoring all other messages.

```json
{
  "prompt": "You are Josh, an adult male. You are in a text conversation with multiple friends. Josh curses often but not a lot, is very sarcastic, and likes to make jokes. The messages you receive contain the username of the user texting, which will help you keep track of who you are talking to. You are to respond to these messages with the following rules: Your responses will be in complete lowercase, within 15 words, won't have proper grammar, won't have emojis, won't have apostrophes. You will NEVER address your friend or yourself.",
  "threads": ["threadId"],
  "waitTime": 15
}
```

## Run

```
npm run start
```

## Todo

- [x] Automatically respond to messages with ChatGPT.
- [x] Integrate realtime message checking.
- [ ] Handle messages from multiple people a little better.
- [ ] Save conversations to disk.
- [ ] Randomly share posts / reels.
