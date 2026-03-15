#!/usr/bin/env bash
# Install omni-subagents to ~/.claude/agents/ as symlinks
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
AGENTS_SRC="$SCRIPT_DIR/../agents"
AGENTS_DST="$HOME/.claude/agents"

mkdir -p "$AGENTS_DST"

for agent in "$AGENTS_SRC"/omni-*.md; do
  name="$(basename "$agent")"
  target="$AGENTS_DST/$name"

  if [ -L "$target" ]; then
    rm "$target"
    echo "  updated: $name"
  elif [ -f "$target" ]; then
    echo "  SKIP: $name (non-symlink file exists, remove manually)"
    continue
  else
    echo "  new: $name"
  fi

  ln -s "$agent" "$target"
done

echo ""
echo "Installed to $AGENTS_DST:"
ls -la "$AGENTS_DST"/omni-*.md 2>/dev/null || echo "  (none)"
