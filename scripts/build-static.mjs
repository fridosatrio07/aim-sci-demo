import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const nextBin = path.join(rootDir, "node_modules", "next", "dist", "bin", "next");
const fixScript = path.join(rootDir, "scripts", "fix-static-file-paths.mjs");

function run(command, args, env = process.env) {
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      cwd: rootDir,
      env,
      stdio: "inherit",
      shell: false
    });

    child.on("close", (code) => resolve(code ?? 1));
    child.on("error", () => resolve(1));
  });
}

const buildCode = await run(process.execPath, [nextBin, "build"], {
  ...process.env,
  NEXT_STATIC_EXPORT: "true"
});

if (buildCode !== 0) {
  process.exit(buildCode);
}

const fixCode = await run(process.execPath, [fixScript]);
process.exit(fixCode);
