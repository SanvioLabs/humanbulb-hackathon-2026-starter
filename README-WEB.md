# Web App Starter

Chat interface. Express backend. Ready to deploy.

## Setup (2 minutes)

```bash
npm install
npm run verify
```

If verify works, you're live.

## Run It

```bash
export AWS_PROFILE=hackathon
npm start
```

Visit `http://localhost:3000`. Type a message. See Claude respond.

## Modify It

### Backend (server.js)

**Lines ~13-17**: Change the system prompt and model ID

```javascript
const SYSTEM_PROMPT = `You are a helpful assistant. ...`;
const MODEL_ID = "us.anthropic.claude-haiku-4-5-20251001-v1:0";
```

**Lines ~38-56**: The `/api/chat` endpoint. Add validation, logging, tool calls here.

### Frontend (public/index.html)

**Lines ~13-15**: Change the header and greeting

```html
<h1>🤖 Your Hackathon App</h1>
<!-- and -->
addMessage("Hello! I'm your AI assistant. Ask me anything.", "assistant");
```

**Lines ~69-110**: The chat UI styling. Change colors, fonts, layout.

**Lines ~130-170**: The chat logic. Add features, change how messages render.

## Extend It

### Add a second Claude call or tool
Modify the `/api/chat` endpoint:

```javascript
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  
  // MODIFY: Add your logic here
  // - Call an external API
  // - Run multiple Claude calls
  // - Use tool_use
  
  const response = await client.send(new ConverseCommand({...}));
  // ...
});
```

### Add a database (DynamoDB)
Import the DynamoDB client, store/retrieve messages:

```javascript
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
const ddb = new DynamoDBClient({ region: "us-east-1" });
// Save messages, retrieve history
```

### Add authentication
Use AWS Cognito or a simple session token:

```javascript
app.post("/api/chat", authenticateUser, async (req, res) => {
  // Only authenticated users can chat
});
```

### Deploy to Lambda + API Gateway
See `scripts/deploy.sh`. Bundle this, zip it, push to Lambda.

## Tips

- **Haiku by default.** Fast iteration. Switch to Sonnet if quality drops.
- **Commit often.** Break it, roll back in seconds.
- **Deploy early.** A live app impresses judges more than a polished local build.
- **Style matters.** Spend 15 minutes on UI. It's half the demo.

## Troubleshooting

| Error | Fix |
|-------|-----|
| Port 3000 already in use | Change `PORT=4000 npm start` or kill the process using port 3000 |
| `Cannot find module express` | Run `npm install` |
| `AccessDenied` on Bedrock | Check `AWS_PROFILE` and `AWS_REGION` |
| Blank chat screen | Check browser console (F12). Check network tab. |

---

Ship it. 🚀
