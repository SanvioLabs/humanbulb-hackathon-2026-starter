# CLI Agent Starter

Fast. Single file. Ready to extend.

## Setup (2 minutes)

```bash
npm install
npm run verify
```

If verify works, you're live.

## Run It

```bash
export AWS_PROFILE=hackathon
node agent.js "What should I build for a hackathon?"
```

The response prints to stdout. Chain it, pipe it, integrate it.

## Modify It

**agent.js** has three sections marked `MODIFY HERE`:

1. **System prompt** (line ~10): Change how Claude behaves
2. **Model** (line ~15): Start with Haiku, switch to Sonnet if needed for harder logic
3. **Inference config** (line ~30): Max tokens, temperature, stop sequences

Everything else is the Bedrock API call. Don't touch it unless you want to.

## Extend It

### Add multi-turn conversation
Keep a messages array, append user + assistant messages, re-send:

```javascript
const messages = [];

async function chat(userMessage) {
  messages.push({ role: "user", content: [{ text: userMessage }] });
  const response = await client.send(new ConverseCommand({
    modelId: MODEL_ID,
    messages,
    system: [{ text: SYSTEM_PROMPT }],
    inferenceConfig: { maxTokens: 1024 },
  }));
  const assistantMessage = response.output.message.content[0].text;
  messages.push({ role: "assistant", content: [{ text: assistantMessage }] });
  return assistantMessage;
}
```

### Add tool use
Pass a `tools` array in ConverseCommand. Claude returns `toolUse` blocks. Call the tool, send the result back. See AWS docs for the schema.

### Integrate with an API
Fetch data, include it in the prompt, send to Claude:

```javascript
const data = await fetch("https://api.example.com/data").then(r => r.json());
const response = await callClaude(`Analyze this: ${JSON.stringify(data)}`);
```

### Deploy to Lambda
See `scripts/deploy.sh`. Bundle this, zip it, push to Lambda, add API Gateway.

## Tips

- **Use Haiku for iteration.** It's fast and cheap. Switch to Sonnet if the output quality drops.
- **Environment variables matter.** Set `AWS_PROFILE=hackathon` in every terminal session.
- **Commit early.** If you break something, `git checkout agent.js` reverts it instantly.

## Troubleshooting

| Error | Fix |
|-------|-----|
| `AccessDenied` | Check `AWS_PROFILE` is set. Check AWS_REGION is `us-east-1`. |
| `Model not found` | Copy the model ID exactly (the `us.` prefix matters). |
| `Cannot find module '@aws-sdk'` | Run `npm install`. |

---

Ship it. 🚀
