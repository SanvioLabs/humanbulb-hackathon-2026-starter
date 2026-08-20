#!/usr/bin/env node

import { BedrockRuntimeClient, ConverseCommand } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({ region: "us-east-1" });

async function verify() {
  console.log("🔍 Verifying Bedrock connection...\n");

  const command = new ConverseCommand({
    modelId: "us.anthropic.claude-haiku-4-5-20251001-v1:0",
    messages: [
      {
        role: "user",
        content: [{ type: "text", text: "Say 'Hello from Bedrock!'" }],
      },
    ],
    inferenceConfig: {
      maxTokens: 100,
    },
  });

  try {
    const response = await client.send(command);
    const message = response.output.message.content[0].text;
    console.log("✅ Success! Bedrock is working.\n");
    console.log(`Response: ${message}\n`);
    console.log("Next: modify agent.js and run: npm start 'your prompt here'\n");
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error("\nCommon fixes:");
    console.error("  1. Run: aws sso login --profile hackathon");
    console.error("  2. Run: export AWS_PROFILE=hackathon");
    console.error("  3. Check AWS_REGION is us-east-1");
    console.error("  4. Check model ID has 'us.' prefix\n");
    process.exit(1);
  }
}

verify();
