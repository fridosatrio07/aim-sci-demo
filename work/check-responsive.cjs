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

const viewports = [
  { name: "desktop-1920", width: 1920, height: 1080 },
  { name: "laptop-1536", width: 1536, height: 864 },
  { name: "desktop-1440", width: 1440, height: 900 },
  { name: "laptop-1366", width: 1366, height: 768 },
  { name: "small-1280", width: 1280, height: 720 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "mobile-390", width: 390, height: 844 }
];

async function waitForHttp(url, timeoutMs = 60000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 750));
  }
  throw new Error(`Timed out waiting for ${url}`);
}

async function main() {
  await waitForHttp("http://localhost:3000/dashboard");

  const { chromium } = require(playwrightPackage);
  const executablePath = fs.existsSync(chromePath) ? chromePath : edgePath;
  const browser = await chromium.launch({ executablePath, headless: true });
  const results = [];

  for (const viewport of viewports) {
    const page = await browser.newPage({ viewport });
    await page.addInitScript(() => window.localStorage.setItem("assetIntegrityAuth", "true"));
    await page.goto("http://localhost:3000/dashboard", { waitUntil: "networkidle" });
    await page.getByLabel("Summary KPI cards").getByText("Total Assets").waitFor({
      timeout: 30000
    });

    const metrics = await page.evaluate(() => ({
      documentClientWidth: document.documentElement.clientWidth,
      documentScrollWidth: document.documentElement.scrollWidth,
      bodyClientWidth: document.body.clientWidth,
      bodyScrollWidth: document.body.scrollWidth
    }));
    const overflow = Math.max(
      metrics.documentScrollWidth - metrics.documentClientWidth,
      metrics.bodyScrollWidth - metrics.bodyClientWidth
    );

    if (["desktop-1440", "laptop-1366", "small-1280", "mobile-390"].includes(viewport.name)) {
      await page.screenshot({
        path: path.join(root, "outputs", `${viewport.name}.png`),
        fullPage: true
      });
    }

    results.push({ ...viewport, overflow, ...metrics });
    await page.close();
  }

  await browser.close();

  console.log(JSON.stringify(results, null, 2));
  const bad = results.filter((result) => result.overflow > 1);
  if (bad.length > 0) {
    throw new Error(`Horizontal overflow detected: ${bad.map((item) => `${item.name}:${item.overflow}`).join(", ")}`);
  }
}

main().catch((error) => {
  console.error(error && error.stack ? error.stack : error);
  process.exit(1);
});
