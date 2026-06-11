const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const nodePath = String.raw`C:\Users\YX0GV\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe`;
const runtimeModules = String.raw`C:\Users\YX0GV\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules`;
const playwrightPackage = path.join(
  runtimeModules,
  ".pnpm",
  "playwright@1.60.0",
  "node_modules",
  "playwright"
);
const nextBin = path.join(root, "node_modules", "next", "dist", "bin", "next");
const previewUrl = "http://localhost:3000";
const screenshotPath = path.join(root, "outputs", "dashboard-preview.png");
const chromePath = String.raw`C:\Program Files\Google\Chrome\Application\chrome.exe`;
const edgePath = String.raw`C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`;

async function waitForHttp(url, timeoutMs = 60000) {
  const start = Date.now();
  let lastError;

  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return response;
      }
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 750));
  }

  throw lastError || new Error(`Timed out waiting for ${url}`);
}

async function main() {
  const server = spawn(nodePath, [nextBin, "dev"], {
    cwd: root,
    env: {
      ...process.env,
      Path: `${path.dirname(nodePath)}${path.delimiter}${process.env.Path || process.env.PATH || ""}`
    },
    stdio: ["ignore", "pipe", "pipe"],
    windowsHide: true
  });

  let stdout = "";
  let stderr = "";
  server.stdout.on("data", (chunk) => {
    stdout += chunk.toString();
  });
  server.stderr.on("data", (chunk) => {
    stderr += chunk.toString();
  });

  try {
    await waitForHttp(previewUrl);

    const { chromium } = require(playwrightPackage);
    const executablePath = fs.existsSync(chromePath) ? chromePath : edgePath;
    const browser = await chromium.launch({ executablePath, headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
    await page.goto(previewUrl, { waitUntil: "networkidle" });
    await page.getByRole("heading", { name: "ASSET INTEGRITY MANAGEMENT" }).waitFor({
      timeout: 30000
    });
    await page.screenshot({ path: screenshotPath, fullPage: true });
    await browser.close();

    const title = await pageTitle(previewUrl);
    console.log(JSON.stringify({ ok: true, url: previewUrl, title, screenshotPath }, null, 2));
  } catch (error) {
    console.error("VERIFY_FAILED");
    console.error(error && error.stack ? error.stack : error);
    console.error("STDOUT:");
    console.error(stdout);
    console.error("STDERR:");
    console.error(stderr);
    process.exitCode = 1;
  } finally {
    server.kill();
  }
}

async function pageTitle(url) {
  const response = await fetch(url);
  const html = await response.text();
  const match = html.match(/<title>(.*?)<\/title>/i);
  return match ? match[1] : "";
}

main();
