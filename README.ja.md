# @philtzjp/omni-subagents

[OpenCode](https://opencode.ai) + [OpenRouter](https://openrouter.ai) 経由で外部AIモデルを呼び出す Claude Code 用サブエージェント。Claude Code 単体では弱いマルチモーダル領域を専門モデルに委譲します。

## サブエージェント一覧

| 名前 | モデル | 用途 |
|---|---|---|
| `omni-vision` | Gemini 3.1 Pro | 画像解析 — UI要素の精密検出、OCR、フローチャート解釈 |
| `omni-codex` | GPT-5.3 Codex | コードのセカンドオピニオン — 別解の提示、盲点の検出 |
| `omni-imagegen` | GPT-5 Image | 画像生成 — ダイアグラム、UIモック、チャート |
| `omni-researcher` | Gemini 3.1 Pro (2M) | 大量コンテキスト分析 — ファイル横断調査、巨大ドキュメント処理 |

## 仕組み

各サブエージェントは軽量リレー（Haiku上で動作）で、内部で `opencode run -m <model>` を実行します。Claude Code が `Agent` ツール経由で自動的に呼び出します。

```
ユーザー → Claude Code → Agent(subagent_type: "omni-vision") → opencode run → OpenRouter → Gemini 3.1 Pro
```

## インストール

```bash
npx @philtzjp/omni-subagents install
```

インストーラーが以下を行います:
1. `opencode` CLI の存在確認
2. OpenRouter APIキーの入力（未設定の場合）
3. サブエージェント定義を `~/.claude/agents/` にコピー

## コマンド

```bash
npx @philtzjp/omni-subagents install     # インストール + キー設定
npx @philtzjp/omni-subagents setup       # OpenRouter APIキーの設定・変更
npx @philtzjp/omni-subagents uninstall   # アンインストール
npx @philtzjp/omni-subagents list        # インストール済みサブエージェント一覧
```

## 必要なもの

- [Claude Code](https://claude.ai/claude-code)
- [OpenCode CLI](https://opencode.ai)（OpenRouter認証済み）
- [OpenRouter APIキー](https://openrouter.ai/keys)

## ライセンス

MIT
