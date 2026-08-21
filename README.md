# Humanbulb Hackathon 2026 — Starter Templates

Pick your starting point. Everything else is up to you.

## 🚀 Two Branches

### `starter/cli-agent`
Build a CLI tool, multi-step agent, or automation. Single file, fast iteration.

```bash
git checkout starter/cli-agent
npm install
export AWS_PROFILE=hackathon
node agent.js "Your prompt here"
```

Good for: workflows, automations, multi-step agents, integrations with APIs.

### `starter/web-app`
Build a web product. Express backend, simple HTML frontend, ready to extend.

```bash
git checkout starter/web-app
npm install
npm start
```

Visit `http://localhost:3000`, modify the prompts, add features.

Good for: web apps, chat interfaces, dashboards, real-time tools.

---

## Setup (Both Branches)

1. **Clone this repo**
2. **Checkout the branch you want** (`git checkout starter/web-app` or `starter/cli-agent`)
3. **Copy `.env.example` to `.env`** (both branches include this)
4. **AWS**: see *AWS Account Setup* below. Setting `AWS_PROFILE` is **not** enough
5. **Verify Bedrock works**: Both branches have a verify step in the README

You get roughly **30 seconds to "hello world"**, then modify from there.

---

## Key Points

- **Haiku by default.** Cheap, fast. Both templates use it. Switch to Sonnet in code if you need stronger reasoning.
- **No authentication.** These templates assume you're running locally or deploying to Lambda with AWS credentials already in place.
- **Modify the prompts first.** Comments mark exactly where to change the system prompt and the logic.
- **Deploy to Lambda when ready.** Both branches include a `scripts/deploy.sh` for serverless.

---

## AWS Account Setup (First Time)

Grab your team's card at the event. Run this once:

```bash
aws configure sso
# SSO session name: hackathon
# SSO start URL: <URL on your card>
# SSO region: us-east-1
# (press enter for Registration scopes)
# Pick your account and the HackathonParticipant role
# CLI region: us-east-1
# Profile name: hackathon

aws sso login --profile hackathon
```

### Then, in every terminal you use

**`export AWS_PROFILE=hackathon` is not enough, and this is the single most
common way to lose half an hour today.**

The AWS CLI understands `AWS_PROFILE`. The Node SDK, Claude Code, Cursor, and
anything else you run mostly do not. They fail like this:

```
ForbiddenException: No access
```

That reads like a permissions problem. It is not. Your account is fine. The
tool could not turn your profile into credentials.

Hand it credentials directly instead:

```bash
unset AWS_PROFILE
eval "$(aws configure export-credentials --profile hackathon --format env)"
```

Then start `npm start`, `node agent.js`, `claude`, or your editor **from that
same terminal**. The credentials expire in 12 hours, so nothing long-lived ends
up in your shell history or your repo.

If something starts failing later in the day, run `aws sso login --profile
hackathon` and then the `eval` line again.

`unset AWS_PROFILE` matters. With both set, some tools take the profile path
and fail anyway.

### Using Claude Code against Bedrock

Two extra variables, and they are not optional. Claude Code picks a model by
tier before it reads `ANTHROPIC_MODEL`, so left alone it reaches for a model
your account cannot use and fails:

```bash
export CLAUDE_CODE_USE_BEDROCK=1
export AWS_REGION=us-east-1
export ANTHROPIC_DEFAULT_OPUS_MODEL=us.anthropic.claude-haiku-4-5-20251001-v1:0
export ANTHROPIC_DEFAULT_SONNET_MODEL=us.anthropic.claude-haiku-4-5-20251001-v1:0
export ANTHROPIC_DEFAULT_HAIKU_MODEL=us.anthropic.claude-haiku-4-5-20251001-v1:0

claude -p "reply with the single word OK"
```

You want `OK` and no warning about a model being unavailable.

---

## When Something Breaks

| Error | Fix |
|-------|-----|
| `ForbiddenException: No access` | **Not a permissions problem.** The tool cannot read your SSO profile. `unset AWS_PROFILE`, then the `eval` line above |
| `Unexpected field type` | Anthropic's native API shape in a `ConverseCommand`. Content blocks are `{ text }` with no `type`, and `system` is a list, not a string |
| `AccessDenied` on Bedrock | Wrong region. Everything lives in `us-east-1` |
| `AccessDenied` on RDS, SageMaker, EC2 | Switched off on purpose. See [what you can use](services-available.md) |
| `Model not found` | Typo, or a missing `us.` prefix. Copy the ID exactly |
| `Session expired` | `aws sso login --profile hackathon`, then the `eval` line again |
| 403 from a Lambda Function URL | Function URLs do not work on these accounts. Use API Gateway |
| Can't import AWS SDK | `npm install` in the branch directory |

Full list of every service and model open to you, and what to reach for when
something is switched off: **[services-available.md](services-available.md)**

Stuck? Grab an organizer. We can see inside your account.

---

## Build Tips

- Commit often. If you break something, roll back.
- Deploy early. A live Lambda beats a perfect local script.
- Use the demo moment. What's the 30-second "wow" to show judges?
- Cut scope at hour 2. Ship what works, not what almost works.

---

*"Where we're going, we don't need boilerplate."* ⚡️
