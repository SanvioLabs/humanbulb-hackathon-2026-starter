import express from "express";
import { BedrockRuntimeClient, ConverseCommand } from "@aws-sdk/client-bedrock-runtime";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

const client = new BedrockRuntimeClient({ region: "us-east-1" });

// ============================================================================
// MODIFY HERE: Change the system prompt
// ============================================================================
const SYSTEM_PROMPT = `You are a helpful assistant. Answer questions clearly and concisely.`;

// ============================================================================
// MODIFY HERE: Define the model. Haiku is default, switch to Sonnet if needed
// ============================================================================
const MODEL_ID = "us.anthropic.claude-haiku-4-5-20251001-v1:0";

// Middleware
app.use(express.json());
app.use(express.static(join(__dirname, "public")));

// API endpoint: Call Claude
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const command = new ConverseCommand({
      modelId: MODEL_ID,
      messages: [
        {
          role: "user",
          // Converse content blocks are { text }. No "type" field: that
          // belongs to Anthropic's native API, and mixing the two shapes
          // fails with "Unexpected field type" without naming the field.
          content: [{ text: message }],
        },
      ],
      // Also a list of blocks, not a string. Same failure, same message.
      system: [{ text: SYSTEM_PROMPT }],
      inferenceConfig: {
        maxTokens: 1024,
      },
    });

    const response = await client.send(command);
    const reply = response.output.message.content[0].text;

    res.json({ reply });
  } catch (error) {
    console.error("Error calling Claude:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Serve the frontend
app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "public", "index.html"));
});

// Start server
app.listen(port, () => {
  console.log(`\n🚀 Server running at http://localhost:${port}`);
  console.log(`📝 Modify: server.js (SYSTEM_PROMPT, MODEL_ID) and public/index.html\n`);
});
