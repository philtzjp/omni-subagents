# @philtzjp/omni-subagents

Claude Code subagents that call external AI models via [OpenCode](https://opencode.ai) + [OpenRouter](https://openrouter.ai). Fills Claude Code's multimodal gaps by delegating to specialized models.

## Subagents

| Name | Model | What it does |
|---|---|---|
| `omni-vision` | Gemini 3.1 Pro | Image/screenshot analysis — fine-grained UI inspection, OCR, diagram interpretation |
| `omni-codex` | GPT-5.3 Codex | Code second opinion — alternative implementations, blind spot detection |
| `omni-imagegen` | GPT-5 Image | Image generation — diagrams, UI mockups, charts, illustrations |
| `omni-researcher` | Gemini 3.1 Pro (2M) | Large-context research — cross-file analysis, massive document processing |

## How it works

Each subagent is a lightweight relay (runs on Haiku) that executes `opencode run -m <model>` under the hood. Claude Code invokes them automatically via the `Agent` tool when it determines an external model would handle the task better.

```
User → Claude Code → Agent(subagent_type: "omni-vision") → opencode run → OpenRouter → Gemini 3.1 Pro
```

## Install

```bash
npx @philtzjp/omni-subagents install
```

The installer will:
1. Check that `opencode` CLI is installed
2. Prompt for your OpenRouter API key (if not already configured)
3. Copy subagent definitions to `~/.claude/agents/`

## Commands

```bash
npx @philtzjp/omni-subagents install     # Install subagents + configure key
npx @philtzjp/omni-subagents setup       # Set or update OpenRouter API key
npx @philtzjp/omni-subagents uninstall   # Remove subagents
npx @philtzjp/omni-subagents list        # Show installed subagents
```

## Requirements

- [Claude Code](https://claude.ai/claude-code)
- [OpenCode CLI](https://opencode.ai) with OpenRouter credentials
- [OpenRouter API key](https://openrouter.ai/keys) with access to the target models

## License

MIT
