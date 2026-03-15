# omni-subagents

Claude Code subagent definitions that call external models via OpenCode + OpenRouter.
Compensates for Claude Code's multimodal gaps.

## Subagents

| Name | Model | Purpose |
|---|---|---|
| `omni-vision` | Gemini 3.1 Pro | Image/screenshot analysis |
| `omni-codex` | GPT-5.3 Codex | Code second opinion |
| `omni-imagegen` | GPT-5 Image | Image generation |
| `omni-researcher` | Gemini 3.1 Pro (2M) | Large-context research |

## Install

```bash
npx @philtzjp/omni-subagents install
```

Or from source:

```bash
bash scripts/install.sh
```

## Requirements

- `opencode` CLI installed with OpenRouter credentials (`opencode providers login`)
- OpenRouter API key with access to the target models
