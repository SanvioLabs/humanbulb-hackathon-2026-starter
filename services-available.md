# What you can build with

Your team gets its own AWS account. It is pre-configured, the credits are already
on it, and there is nothing to sign up for.

The account is deliberately narrow. Everything below is open. Everything else is
switched off on purpose, so nobody accidentally spends the room's credits on a
GPU they forgot to turn off. If something returns **AccessDenied**, that is the
guardrail doing its job, not a bug. Pick a different tool and keep moving.

**Region: `us-east-1`.** Everything you create has to live there. Other regions
are blocked, and the most common "why doesn't this work" of the day is being in
the wrong one. Check the top right of the console.

---

## Sign in

You get a card with a username and password. There are no access keys, and you
do not need any.

1. Go to the portal URL on your card
2. Sign in with the username and password on the card
3. Click into your team's account

For the CLI, run `aws configure sso` and use the same portal URL. You get
temporary credentials that refresh themselves. If you find yourself pasting an
`AWS_ACCESS_KEY_ID` anywhere, stop, you are on the wrong path.

---

## Build with

| What you want | Use | Notes |
|---|---|---|
| Run code | **Lambda** | Your backend. No servers to manage |
| An API | **API Gateway** | Put it in front of Lambda |
| A database | **DynamoDB** | Fast to start, no setup |
| Files and static sites | **S3** | Host your front end straight out of a bucket |
| A CDN or a domain | **CloudFront**, **ACM** | |
| Front-end hosting | **Amplify** | Connect a repo, get a URL |
| User sign-up and login | **Cognito** | Free tier covers a hackathon many times over |
| Queues and events | **SQS**, **SNS**, **EventBridge** | |
| Multi-step workflows | **Step Functions** | |
| Scheduling | **EventBridge Scheduler** | |
| Config and secrets | **SSM Parameter Store** | |
| Logs and debugging | **CloudWatch**, **X-Ray** | Your first stop when something breaks |
| Infrastructure as code | **CloudFormation** | Or the CDK, or SAM |

## AI services

All pay-per-use, all cheap, none of them need setting up.

| What you want | Use |
|---|---|
| Text, chat, reasoning, agents | **Bedrock** (models below) |
| Text to speech | **Polly** |
| Speech to text | **Transcribe** |
| Translation | **Translate** |
| Sentiment, entities, PII detection | **Comprehend** |
| Image and video analysis | **Rekognition** |
| Documents, forms, tables, OCR | **Textract** |

## Models on Bedrock

Use these model IDs exactly. The `us.` prefix matters: those models route across
regions internally and the call fails without it.

**Text**

```
us.anthropic.claude-haiku-4-5-20251001-v1:0     fast and cheap, START HERE
us.anthropic.claude-sonnet-4-6                  strongest available, use when Haiku struggles
us.anthropic.claude-sonnet-4-5-20250929-v1:0    previous Sonnet, also fine
amazon.nova-micro-v1:0                          cheapest option available
amazon.nova-lite-v1:0
amazon.nova-pro-v1:0
meta.llama3-3-70b-instruct-v1:0                 open weights
openai.gpt-oss-120b-1:0                         open weights
mistral.mixtral-8x7b-instruct-v0:1              open weights
qwen.qwen3-32b-v1:0                             open weights
deepseek.v3.2                                   open weights
moonshotai.kimi-k2.5                            open weights
minimax.minimax-m2.5                            open weights
zai.glm-4.7                                     open weights
```

**Reasoning models.** These think out loud before answering, which is genuinely
useful on hard problems and produces a lot more output tokens than a normal
reply. Fine to use. Do not put one in a loop and walk away.

```
us.deepseek.r1-v1:0
moonshot.kimi-k2-thinking
```

**Embeddings**, for search and RAG

```
amazon.titan-embed-text-v2:0
cohere.embed-v4:0
cohere.rerank-v3-5:0
```

**Images**

```
amazon.nova-canvas-v1:0
```

Image generation is billed per image, not per token. Generate in a loop by
accident and you will burn through the room's credits fast. Put a counter on it.

**Point your coding agent at Haiku.** The room shares one credit pool, and a
coding agent running for four hours is by far the largest consumer in it. For
Claude Code:

```bash
export CLAUDE_CODE_USE_BEDROCK=1
export AWS_REGION=us-east-1
export ANTHROPIC_DEFAULT_OPUS_MODEL=us.anthropic.claude-haiku-4-5-20251001-v1:0
export ANTHROPIC_DEFAULT_SONNET_MODEL=us.anthropic.claude-haiku-4-5-20251001-v1:0
export ANTHROPIC_DEFAULT_HAIKU_MODEL=us.anthropic.claude-haiku-4-5-20251001-v1:0
```

Save Sonnet for calls your application makes, where the volume is a fraction of
what the agent uses.

**Voice**

```
amazon.nova-sonic-v1:0        speech in, speech out
```

Quick check that your account works:

```bash
aws bedrock-runtime converse \
  --model-id us.anthropic.claude-haiku-4-5-20251001-v1:0 \
  --messages '[{"role":"user","content":[{"text":"say hello"}]}]' \
  --inference-config '{"maxTokens":50}' \
  --region us-east-1
```

---

## Switched off

Not obstacles to work around. There is a good alternative for every one of them.

| Blocked | Use instead |
|---|---|
| EC2 | Lambda. You do not need a server for a one-day build |
| RDS, Aurora, OpenSearch, ElastiCache | DynamoDB |
| SageMaker | Bedrock |
| Glue, Athena, EMR, Kinesis, Kafka | Lambda and S3 |
| Claude Opus, Nova Premier, GPT-5.6, Grok | Sonnet 4.5 is the strongest model open to you |
| Nova Reel (video generation) | Nova Canvas for stills |
| Any region except us-east-1 | us-east-1 |
| IAM users and access keys | The SSO login on your card |
| Marketplace subscriptions | |

**Bedrock Knowledge Bases will not work.** They need a vector store, and the ones
they support are all switched off. If you want RAG, embed with Titan or Cohere
and keep the vectors in DynamoDB or in memory. For a one-day build, in memory is
almost always the right answer.

---

## When something breaks

| Message | What it means |
|---|---|
| `AccessDenied` on Bedrock | Wrong model ID. Check the `us.` prefix, and check the model is on the list above |
| `AccessDenied` on anything else | Wrong region, or the service is switched off. Check the top right of the console first |
| `UnauthorizedOperation` on EC2 | EC2 is off. Use Lambda |
| Your session expired | Sign in again at the portal. Sessions last 12 hours |
| `ValidationException` on Bedrock | Usually a malformed request body, not a permissions problem |
| 403 Forbidden from a Lambda **Function URL** | Function URLs are refused on these accounts even when configured correctly. Use **API Gateway** instead, it works. The starter does this |

Still stuck? Grab an organizer. We can see inside your account.
