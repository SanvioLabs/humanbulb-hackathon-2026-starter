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
4. **AWS**: Set your profile: `export AWS_PROFILE=hackathon`
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
# Pick your account and HackathonParticipant role
# CLI region: us-east-1
# Profile name: hackathon

aws sso login --profile hackathon
export AWS_PROFILE=hackathon
```

That last export matters. Set it in every new terminal.

---

## When Something Breaks

| Error | Fix |
|-------|-----|
| `AccessDenied` on Bedrock | Check region is `us-east-1`. Check AWS_PROFILE is set. |
| `Model not found` | Model ID has a typo or the `us.` prefix is missing. Copy exactly from the template. |
| `Session expired` | Run `aws sso login --profile hackathon` again. Sessions last 12 hours. |
| Can't import AWS SDK | Run `npm install` in the branch directory. |

Stuck? Grab an organizer.

---

## Build Tips

- Commit often. If you break something, roll back.
- Deploy early. A live Lambda beats a perfect local script.
- Use the demo moment. What's the 30-second "wow" to show judges?
- Cut scope at hour 2. Ship what works, not what almost works.

---

*"Where we're going, we don't need boilerplate."* ⚡️
