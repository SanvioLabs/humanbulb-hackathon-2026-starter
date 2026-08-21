#!/usr/bin/env node

import { BedrockRuntimeClient, ConverseCommand } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({ region: "us-east-1" });

// ============================================================================
// MODIFY HERE: Change the system prompt to define your agent's behavior
// ============================================================================
const SYSTEM_PROMPT = `You are a helpful assistant. Answer questions clearly and concisely.`;

// ============================================================================
// MODIFY HERE: Define the model. Start with Haiku (cheap), switch to Sonnet if needed
// ============================================================================
const MODEL_ID = "us.anthropic.claude-haiku-4-5-20251001-v1:0";

async function callClaude(userMessage) {
  const command = new ConverseCommand({
    modelId: MODEL_ID,
    messages: [
      {
        role: "user",
        // Converse content blocks are { text }. No "type" field: that belongs
        // to Anthropic's native API, and mixing the two shapes fails with
        // "Unexpected field type" without saying which field.
        content: [{ text: userMessage }],
      },
    ],
    // Also a list of blocks, not a string. Same failure, same message.
    system: [{ text: SYSTEM_PROMPT }],
    inferenceConfig: {
      maxTokens: 1024,
    },
  });

  try {
    const response = await client.send(command);
    return response.output.message.content[0].text;
  } catch (error) {
    console.error("Error calling Claude:", error.message);
    throw error;
  }
}

async function main() {
  // Get user input from command line arguments
  const userInput = process.argv.slice(2).join(" ");

  if (!userInput) {
    console.error("Usage: node agent.js <your question or prompt>");
    process.exit(1);
  }

  console.log(`\n📝 Input: ${userInput}`);
  console.log("⏳ Thinking...\n");

  try {
    const response = await callClaude(userInput);
    console.log("💭 Response:\n");
    console.log(response);
    console.log("\n");
  } catch (error) {
    process.exit(1);
  }
}

main();
