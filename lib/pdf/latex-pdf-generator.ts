import { spawn, spawnSync } from "child_process"
import fs from "fs-extra"
import path from "path"
import { StageResumeData } from "../ai/gemini-stage-parser"

interface CommandResult {
  stdout: string
  stderr: string
}

interface CommandSpec {
  command: string
  args: string[]
}

const LATEX_TIMEOUT_MS = 120_000

function isCommandAvailable(command: string, args: string[] = ["--version"]): boolean {
  try {
    const result = spawnSync(command, args, { stdio: "pipe" })
    return !result.error
  } catch {
    return false
  }
}

function resolvePythonCommand(scriptPath: string, args: string[]): CommandSpec | null {
  const candidates: CommandSpec[] = [
    { command: "python", args: [scriptPath, ...args] },
    { command: "py", args: ["-3", scriptPath, ...args] },
  ]

  for (const candidate of candidates) {
    const probeArgs = candidate.command === "py" ? ["-3", "--version"] : ["--version"]
    if (isCommandAvailable(candidate.command, probeArgs)) {
      return candidate
    }
  }

  return null
}

function runCommand(
  spec: CommandSpec,
  cwd?: string,
  timeoutMs = LATEX_TIMEOUT_MS
): Promise<CommandResult> {
  return new Promise((resolve, reject) => {
    const child = spawn(spec.command, spec.args, {
      cwd,
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true,
    })

    let stdout = ""
    let stderr = ""

    child.stdout.on("data", (chunk: Buffer | string) => {
      stdout += chunk.toString()
    })

    child.stderr.on("data", (chunk: Buffer | string) => {
      stderr += chunk.toString()
    })

    const timeout = setTimeout(() => {
      child.kill()
      reject(new Error(`Command timed out: ${spec.command} ${spec.args.join(" ")}`))
    }, timeoutMs)

    child.on("error", (error) => {
      clearTimeout(timeout)
      reject(error)
    })

    child.on("close", (code) => {
      clearTimeout(timeout)
      if (code === 0) {
        resolve({ stdout, stderr })
        return
      }

      reject(
        new Error(
          `Command failed (${spec.command} ${spec.args.join(" ")}): ${
            stderr.trim() || stdout.trim() || `exit code ${code}`
          }`
        )
      )
    })
  })
}

export function isLatexPdfGenerationAvailable(): boolean {
  const pythonAvailable =
    isCommandAvailable("python") || isCommandAvailable("py", ["-3", "--version"])
  const pdflatexAvailable = isCommandAvailable("pdflatex")
  return pythonAvailable && pdflatexAvailable
}

export async function generateLatexResumePDF(
  fileId: string,
  resumeData: StageResumeData
): Promise<Buffer> {
  const tempDir = path.join(process.cwd(), "uploads", "latex", fileId)
  const inputJsonPath = path.join(tempDir, "resume-input.json")
  const outputTexPath = path.join(tempDir, "resume-output.tex")
  const outputPdfPath = path.join(tempDir, "resume-output.pdf")
  const scriptPath = path.join(process.cwd(), "scripts", "render_latex_resume.py")
  const templatePath = path.join(process.cwd(), "lib", "templates", "jakes-resume-latex.tex.j2")

  await fs.ensureDir(tempDir)
  await fs.writeJson(inputJsonPath, resumeData, { spaces: 2 })

  try {
    const pythonSpec = resolvePythonCommand(scriptPath, [
      "--input-json",
      inputJsonPath,
      "--template",
      templatePath,
      "--output-tex",
      outputTexPath,
    ])

    if (!pythonSpec) {
      throw new Error("Python 3 is not available for LaTeX template rendering")
    }

    await runCommand(pythonSpec, process.cwd())

    if (!isCommandAvailable("pdflatex")) {
      throw new Error("pdflatex is not installed or not available in PATH")
    }

    const latexCompileSpec: CommandSpec = {
      command: "pdflatex",
      args: [
        "-interaction=nonstopmode",
        "-halt-on-error",
        `-output-directory=${tempDir}`,
        outputTexPath,
      ],
    }

    // Compile twice for stable references/formatting consistency.
    await runCommand(latexCompileSpec, tempDir)
    await runCommand(latexCompileSpec, tempDir)

    if (!(await fs.pathExists(outputPdfPath))) {
      throw new Error("pdflatex completed but output PDF was not generated")
    }

    return await fs.readFile(outputPdfPath)
  } finally {
    // Keep only the final generated PDF in uploads/generated.
    await fs.remove(tempDir).catch(() => undefined)
  }
}

