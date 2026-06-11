import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const outDir = path.join(rootDir, "out");
const backupRoot = path.join(rootDir, ".static-build-backup");
const backupDir = path.join(backupRoot, "out");

function runNextBuild() {
  const nextBin = path.join(rootDir, "node_modules", "next", "dist", "bin", "next");

  return new Promise((resolve) => {
    const child = spawn(process.execPath, [nextBin, "build"], {
      cwd: rootDir,
      stdio: "inherit",
      shell: false
    });

    child.on("close", (code) => resolve(code ?? 1));
    child.on("error", () => resolve(1));
  });
}

function runStaticFilePathFix() {
  const scriptPath = path.join(rootDir, "scripts", "fix-static-file-paths.mjs");

  return new Promise((resolve) => {
    const child = spawn(process.execPath, [scriptPath], {
      cwd: rootDir,
      stdio: "inherit",
      shell: false
    });

    child.on("close", (code) => resolve(code ?? 1));
    child.on("error", () => resolve(1));
  });
}

async function backupCurrentOut() {
  await rm(backupRoot, { recursive: true, force: true });
  await mkdir(backupRoot, { recursive: true });

  if (existsSync(outDir)) {
    await cp(outDir, backupDir, { recursive: true });
    return true;
  }

  return false;
}

async function restoreBackup(hasBackup) {
  await rm(outDir, { recursive: true, force: true });

  if (hasBackup) {
    await cp(backupDir, outDir, { recursive: true });
  }
}

async function main() {
  console.log("Preparing safe static build...");
  const hasBackup = await backupCurrentOut();
  const exitCode = await runNextBuild();
  const fixExitCode = exitCode === 0 ? await runStaticFilePathFix() : 1;

  if (exitCode === 0 && fixExitCode === 0) {
    await rm(backupRoot, { recursive: true, force: true });
    console.log("Static export completed successfully. Updated out/.");
    return;
  }

  await restoreBackup(hasBackup);
  console.error("Static export failed. Previous out/ has been preserved.");
  process.exit(exitCode || fixExitCode);
}

main().catch(async (error) => {
  console.error(error);
  await restoreBackup(existsSync(backupDir)).catch(() => {});
  process.exit(1);
});
