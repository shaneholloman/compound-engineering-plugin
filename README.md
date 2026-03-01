# Compound Marketplace

[![Build Status](https://github.com/EveryInc/compound-engineering-plugin/actions/workflows/ci.yml/badge.svg)](https://github.com/EveryInc/compound-engineering-plugin/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/@every-env/compound-plugin)](https://www.npmjs.com/package/@every-env/compound-plugin)

A Claude Code plugin marketplace featuring the **Compound Engineering Plugin** — tools that make each unit of engineering work easier than the last.

## Claude Code Install

```bash
/plugin marketplace add EveryInc/compound-engineering-plugin
/plugin install compound-engineering
```

## Cursor Install

```text
/add-plugin compound-engineering
```

## OpenCode, Codex, Droid, Pi, Gemini, Copilot, Kiro, Windsurf, OpenClaw & Qwen (experimental) Install

This repo includes a Bun/TypeScript CLI that converts Claude Code plugins to OpenCode, Codex, Factory Droid, Pi, Gemini CLI, GitHub Copilot, Kiro CLI, Windsurf, OpenClaw, and Qwen Code.

```bash
# convert the compound-engineering plugin into OpenCode format
bunx @every-env/compound-plugin install compound-engineering --to opencode

# convert to Codex format
bunx @every-env/compound-plugin install compound-engineering --to codex

# convert to Factory Droid format
bunx @every-env/compound-plugin install compound-engineering --to droid

# convert to Pi format
bunx @every-env/compound-plugin install compound-engineering --to pi

# convert to Gemini CLI format
bunx @every-env/compound-plugin install compound-engineering --to gemini

# convert to GitHub Copilot format
bunx @every-env/compound-plugin install compound-engineering --to copilot

# convert to Kiro CLI format
bunx @every-env/compound-plugin install compound-engineering --to kiro

# convert to OpenClaw format
bunx @every-env/compound-plugin install compound-engineering --to openclaw

# convert to Windsurf format (global scope by default)
bunx @every-env/compound-plugin install compound-engineering --to windsurf

# convert to Windsurf workspace scope
bunx @every-env/compound-plugin install compound-engineering --to windsurf --scope workspace

# convert to Qwen Code format
bunx @every-env/compound-plugin install compound-engineering --to qwen

# auto-detect installed tools and install to all
bunx @every-env/compound-plugin install compound-engineering --to all
```

Local dev:

```bash
bun run src/index.ts install ./plugins/compound-engineering --to opencode
```

<details>
<summary>Output format details per target</summary>

| Target | Output path | Notes |
|--------|------------|-------|
| `opencode` | `~/.config/opencode/` | Commands as `.md` files; `opencode.json` MCP config deep-merged; backups made before overwriting |
| `codex` | `~/.codex/prompts` + `~/.codex/skills` | Each command becomes a prompt + skill pair; descriptions truncated to 1024 chars |
| `droid` | `~/.factory/` | Tool names mapped (`Bash`→`Execute`, `Write`→`Create`); namespace prefixes stripped |
| `pi` | `~/.pi/agent/` | Prompts, skills, extensions, and `mcporter.json` for MCPorter interoperability |
| `gemini` | `.gemini/` | Skills from agents; commands as `.toml`; namespaced commands become directories (`workflows:plan` → `commands/workflows/plan.toml`) |
| `copilot` | `.github/` | Agents as `.agent.md` with Copilot frontmatter; MCP env vars prefixed with `COPILOT_MCP_` |
| `kiro` | `.kiro/` | Agents as JSON configs + prompt `.md` files; only stdio MCP servers supported |
| `openclaw` | `~/.openclaw/extensions/<plugin>/` | Entry-point TypeScript skill file; `openclaw-extension.json` for MCP servers |
| `windsurf` | `~/.codeium/windsurf/` (global) or `.windsurf/` (workspace) | Agents become skills; commands become flat workflows; `mcp_config.json` merged |
| `qwen` | `~/.qwen/extensions/<plugin>/` | Agents as `.yaml`; env vars with placeholders extracted as settings; colon separator for nested commands |

All provider targets are experimental and may change as the formats evolve.

</details>

## Sync Personal Config

Sync your personal Claude Code config (`~/.claude/`) to other AI coding tools. Omit `--target` to sync to all detected tools automatically:

```bash
# Sync to all detected tools (default)
bunx @every-env/compound-plugin sync

# Sync skills and MCP servers to OpenCode
bunx @every-env/compound-plugin sync --target opencode

# Sync to Codex
bunx @every-env/compound-plugin sync --target codex

# Sync to Pi
bunx @every-env/compound-plugin sync --target pi

# Sync to Droid (skills only)
bunx @every-env/compound-plugin sync --target droid

# Sync to GitHub Copilot (skills + MCP servers)
bunx @every-env/compound-plugin sync --target copilot

# Sync to Gemini (skills + MCP servers)
bunx @every-env/compound-plugin sync --target gemini

# Sync to all detected tools
bunx @every-env/compound-plugin sync --target all
```

This syncs:
- Personal skills from `~/.claude/skills/` (as symlinks)
- MCP servers from `~/.claude/settings.json`

Skills are symlinked (not copied) so changes in Claude Code are reflected immediately.

## Workflow

```
Plan → Work → Review → Compound → Repeat
```

| Command | Purpose |
|---------|---------|
| `/workflows:plan` | Turn feature ideas into detailed implementation plans |
| `/workflows:work` | Execute plans with worktrees and task tracking |
| `/workflows:review` | Multi-agent code review before merging |
| `/workflows:compound` | Document learnings to make future work easier |

Each cycle compounds: plans inform future plans, reviews catch more issues, patterns get documented.

## Philosophy

**Each unit of engineering work should make subsequent units easier—not harder.**

Traditional development accumulates technical debt. Every feature adds complexity. The codebase becomes harder to work with over time.

Compound engineering inverts this. 80% is in planning and review, 20% is in execution:
- Plan thoroughly before writing code
- Review to catch issues and capture learnings
- Codify knowledge so it's reusable
- Keep quality high so future changes are easy

## Learn More

- [Full component reference](plugins/compound-engineering/README.md) - all agents, commands, skills
- [Compound engineering: how Every codes with agents](https://every.to/chain-of-thought/compound-engineering-how-every-codes-with-agents)
- [The story behind compounding engineering](https://every.to/source-code/my-ai-had-already-fixed-the-code-before-i-saw-it)
