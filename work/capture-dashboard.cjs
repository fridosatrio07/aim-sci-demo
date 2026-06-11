const path = require("path");
const fs = require("fs");

const runtimeModules = String.raw`C:\Users\YX0GV\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules`;
const playwrightPackage = path.join(
  runtimeModules,
  ".pnpm",
  "playwright@1.60.0",
  "node_modules",
  "playwright"
);
const chromePath = String.raw`C:\Program Files\Google\Chrome\Application\chrome.exe`;
const edgePath = String.raw`C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`;
const root = path.resolve(__dirname, "..");
const screenshotPath = path.join(root, "outputs", "dashboard-preview.png");

async function main() {
  const { chromium } = require(playwrightPackage);
  const executablePath = fs.existsSync(chromePath) ? chromePath : edgePath;
  const browser = await chromium.launch({ executablePath, headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.getByRole("heading", { name: "ASSET INTEGRITY MANAGEMENT" }).waitFor({
    timeout: 30000
  });
  await page.screenshot({ path: screenshotPath, fullPage: true });
  const title = await page.title();
  await browser.close();

  console.log(JSON.stringify({ ok: true, title, screenshotPath }, null, 2));
}

main().catch((error) => {
  console.error(error && error.stack ? error.stack : error);
  process.exit(1);
});
