#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const os = require("os");
const { execFileSync } = require("child_process");
const readline = require("readline");

const AGENTS_SRC = path.join(__dirname, "..", "agents");
const AGENTS_DST = path.join(os.homedir(), ".claude", "agents");
const AUTH_PATH = path.join(
  os.homedir(),
  ".local",
  "share",
  "opencode",
  "auth.json"
);
const PREFIX = "omni-";

function getAgentFiles() {
  return fs
    .readdirSync(AGENTS_SRC)
    .filter((f) => f.startsWith(PREFIX) && f.endsWith(".md"));
}

function prompt(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stderr,
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function hasOpencode() {
  try {
    execFileSync("which", ["opencode"], { stdio: "pipe" });
    return true;
  } catch {
    return false;
  }
}

function hasOpenRouterKey() {
  if (!fs.existsSync(AUTH_PATH)) return false;
  try {
    const auth = JSON.parse(fs.readFileSync(AUTH_PATH, "utf-8"));
    return Boolean(auth.openrouter);
  } catch {
    return false;
  }
}

function saveOpenRouterKey(key) {
  const dir = path.dirname(AUTH_PATH);
  fs.mkdirSync(dir, { recursive: true });

  let auth = {};
  if (fs.existsSync(AUTH_PATH)) {
    try {
      auth = JSON.parse(fs.readFileSync(AUTH_PATH, "utf-8"));
    } catch {
      // corrupted file, start fresh
    }
  }
  auth.openrouter = key;
  fs.writeFileSync(AUTH_PATH, JSON.stringify(auth, null, 2) + "\n", {
    mode: 0o600,
  });
}

function copyAgents() {
  fs.mkdirSync(AGENTS_DST, { recursive: true });
  const files = getAgentFiles();
  for (const file of files) {
    const src = path.join(AGENTS_SRC, file);
    const dst = path.join(AGENTS_DST, file);
    fs.copyFileSync(src, dst);
    console.log(`  installed: ${file}`);
  }
  console.log(`\n${files.length} subagents installed to ${AGENTS_DST}`);
}

async function install() {
  // 1. Check opencode
  if (!hasOpencode()) {
    console.log("\u2717 opencode CLI not found.");
    console.log("  Install from https://opencode.ai first, then run again.");
    process.exit(1);
  }
  console.log("\u2713 opencode CLI found\n");

  // 2. Check / ask for OpenRouter key
  if (hasOpenRouterKey()) {
    console.log("\u2713 OpenRouter API key already configured\n");
  } else {
    console.log("OpenRouter API key is required for omni-subagents.");
    console.log("Get one at https://openrouter.ai/keys\n");
    const key = await prompt("OpenRouter API key: ");
    if (!key) {
      console.log("\nNo key provided. You can set it later with:");
      console.log("  omni-subagents setup\n");
    } else {
      saveOpenRouterKey(key);
      console.log("\u2713 OpenRouter API key saved\n");
    }
  }

  // 3. Copy agent files
  copyAgents();
}

async function setup() {
  if (!hasOpencode()) {
    console.log("\u2717 opencode CLI not found.");
    console.log("  Install from https://opencode.ai first.");
    process.exit(1);
  }

  if (hasOpenRouterKey()) {
    const answer = await prompt(
      "OpenRouter API key is already set. Replace it? (y/N): "
    );
    if (answer.toLowerCase() !== "y") {
      console.log("Kept existing key.");
      return;
    }
  }

  console.log("Get your key at https://openrouter.ai/keys\n");
  const key = await prompt("OpenRouter API key: ");
  if (!key) {
    console.log("No key provided.");
    return;
  }
  saveOpenRouterKey(key);
  console.log("\u2713 OpenRouter API key saved");
}

function uninstall() {
  if (!fs.existsSync(AGENTS_DST)) {
    console.log("Nothing to uninstall.");
    return;
  }
  let count = 0;
  for (const file of fs.readdirSync(AGENTS_DST)) {
    if (file.startsWith(PREFIX) && file.endsWith(".md")) {
      fs.unlinkSync(path.join(AGENTS_DST, file));
      console.log(`  removed: ${file}`);
      count++;
    }
  }
  console.log(`\n${count} subagents removed.`);
}

function list() {
  if (!fs.existsSync(AGENTS_DST)) {
    console.log("No subagents installed.");
    return;
  }
  const installed = fs
    .readdirSync(AGENTS_DST)
    .filter((f) => f.startsWith(PREFIX) && f.endsWith(".md"));
  if (installed.length === 0) {
    console.log("No omni-subagents installed.");
    return;
  }
  console.log(`Installed in ${AGENTS_DST}:\n`);
  for (const file of installed) {
    const content = fs.readFileSync(path.join(AGENTS_DST, file), "utf-8");
    const nameMatch = content.match(/^name:\s*(.+)$/m);
    const name = nameMatch ? nameMatch[1] : file;
    console.log(`  ${name}`);
  }
}

const cmd = process.argv[2];
switch (cmd) {
  case "install":
    install();
    break;
  case "setup":
    setup();
    break;
  case "uninstall":
    uninstall();
    break;
  case "list":
  case "ls":
    list();
    break;
  default:
    console.log("Usage: omni-subagents <command>\n");
    console.log("Commands:");
    console.log("  install     Install subagents + configure OpenRouter key");
    console.log("  setup       Set or update OpenRouter API key");
    console.log("  uninstall   Remove omni-subagents");
    console.log("  list        Show installed subagents");
    process.exit(cmd ? 1 : 0);
}
