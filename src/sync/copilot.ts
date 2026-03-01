import fs from "fs/promises"
import path from "path"
import type { ClaudeHomeConfig } from "../parsers/claude-home"
import type { ClaudeMcpServer } from "../types/claude"
import { forceSymlink, isValidSkillName } from "../utils/symlink"

type CopilotMcpServer = {
  type: string
  command?: string
  args?: string[]
  url?: string
  tools: string[]
  env?: Record<string, string>
  headers?: Record<string, string>
}

type CopilotMcpConfig = {
  mcpServers: Record<string, CopilotMcpServer>
}

export async function syncToCopilot(
  config: ClaudeHomeConfig,
  outputRoot: string,
): Promise<void> {
  const skillsDir = path.join(outputRoot, "skills")
  await fs.mkdir(skillsDir, { recursive: true })

  for (const skill of config.skills) {
    if (!isValidSkillName(skill.name)) {
      console.warn(`Skipping skill with invalid name: ${skill.name}`)
      continue
    }
    const target = path.join(skillsDir, skill.name)
    await forceSymlink(skill.sourceDir, target)
  }

  if (Object.keys(config.mcpServers).length > 0) {
    const mcpPath = path.join(outputRoot, "copilot-mcp-config.json")
    const existing = await readJsonSafe(mcpPath)
    const converted = convertMcpForCopilot(config.mcpServers)
    const merged: CopilotMcpConfig = {
      mcpServers: {
        ...(existing.mcpServers ?? {}),
        ...converted,
      },
    }
    await fs.writeFile(mcpPath, JSON.stringify(merged, null, 2), { mode: 0o600 })
  }
}

async function readJsonSafe(filePath: string): Promise<Partial<CopilotMcpConfig>> {
  try {
    const content = await fs.readFile(filePath, "utf-8")
    return JSON.parse(content) as Partial<CopilotMcpConfig>
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      return {}
    }
    throw err
  }
}

function convertMcpForCopilot(
  servers: Record<string, ClaudeMcpServer>,
): Record<string, CopilotMcpServer> {
  const result: Record<string, CopilotMcpServer> = {}
  for (const [name, server] of Object.entries(servers)) {
    const entry: CopilotMcpServer = {
      type: server.command ? "local" : "sse",
      tools: ["*"],
    }

    if (server.command) {
      entry.command = server.command
      if (server.args && server.args.length > 0) entry.args = server.args
    } else if (server.url) {
      entry.url = server.url
      if (server.headers && Object.keys(server.headers).length > 0) entry.headers = server.headers
    }

    if (server.env && Object.keys(server.env).length > 0) {
      entry.env = prefixEnvVars(server.env)
    }

    result[name] = entry
  }
  return result
}

function prefixEnvVars(env: Record<string, string>): Record<string, string> {
  const result: Record<string, string> = {}
  for (const [key, value] of Object.entries(env)) {
    if (key.startsWith("COPILOT_MCP_")) {
      result[key] = value
    } else {
      result[`COPILOT_MCP_${key}`] = value
    }
  }
  return result
}
