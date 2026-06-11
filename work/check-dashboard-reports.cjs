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
const outputDir = path.join(root, "outputs");

const viewports = [
  { name: "1920", width: 1920, height: 1080 },
  { name: "1440", width: 1440, height: 900 },
  { name: "1366", width: 1366, height: 768 },
  { name: "1280", width: 1280, height: 720 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 390, height: 844 }
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

async function overflow(page) {
  return page.evaluate(() => Math.max(
    document.documentElement.scrollWidth - document.documentElement.clientWidth,
    document.body.scrollWidth - document.body.clientWidth
  ));
}

function storageState() {
  return {
    cookies: [],
    origins: [
      {
        origin: "http://localhost:3000",
        localStorage: [
          { name: "assetIntegrityAuth", value: "true" },
          { name: "assetIntegrityRememberMe", value: "true" },
          { name: "assetIntegrityLoginAt", value: String(Date.now()) },
          { name: "assetIntegrityUser", value: JSON.stringify({ username: "superadmin", name: "Budi Santoso", role: "Superadmin", organization: "SUCOFINDO" }) },
          { name: "assetIntegrityTheme", value: "light" },
          { name: "assetIntegrityThemeSource", value: "manual" }
        ]
      }
    ]
  };
}

async function main() {
  await waitForHttp("http://localhost:3000/dashboard");
  fs.mkdirSync(outputDir, { recursive: true });

  const { chromium } = require(playwrightPackage);
  const executablePath = fs.existsSync(chromePath) ? chromePath : edgePath;
  const browser = await chromium.launch({ executablePath, headless: true });
  const results = [];

  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport, storageState: storageState() });
    const page = await context.newPage();

    await page.goto("http://localhost:3000/dashboard", { waitUntil: "networkidle" });
    await page.getByRole("heading", { name: "Dashboard" }).waitFor({ timeout: 30000 });
    await page.getByText("1. Risk Overview").waitFor({ timeout: 30000 });
    await page.getByText("2. Top 10 Critical Assets").waitFor({ timeout: 30000 });
    await page.getByText("7. Action Priority").waitFor({ timeout: 30000 });
    const dashboardOverflow = await overflow(page);
    if (["1366", "1280", "mobile"].includes(viewport.name)) {
      await page.screenshot({ path: path.join(outputDir, `revised-dashboard-${viewport.name}.png`), fullPage: true });
    }

    await page.goto("http://localhost:3000/reports", { waitUntil: "networkidle" });
    await page.getByRole("heading", { name: "Reports" }).waitFor({ timeout: 30000 });
    await page.getByText("Report Templates").waitFor({ timeout: 30000 });
    await page.getByRole("heading", { name: "Generate Report" }).waitFor({ timeout: 30000 });
    await page.getByText("Generated Report History").waitFor({ timeout: 30000 });

    await page.getByRole("button", { name: "Generate Report" }).click();
    await page.getByText("Please select a report type before generating a report.").waitFor({ timeout: 5000 });
    await page.getByRole("button", { name: "Select" }).first().click();
    page.once("dialog", async (dialog) => {
      if (dialog.message() !== "Report generation started in prototype mode.") {
        throw new Error(`Unexpected report alert: ${dialog.message()}`);
      }
      await dialog.accept();
    });
    await page.getByRole("button", { name: "Generate Report" }).click();
    await page.getByText("Report generation started in prototype mode.").waitFor({ timeout: 5000 });
    const reportsOverflow = await overflow(page);
    if (["1366", "1280", "mobile"].includes(viewport.name)) {
      await page.screenshot({ path: path.join(outputDir, `reports-${viewport.name}.png`), fullPage: true });
    }

    results.push({ viewport: viewport.name, dashboardOverflow, reportsOverflow });
    await context.close();
  }

  await browser.close();

  console.log(JSON.stringify(results, null, 2));
  const bad = results.filter((item) => item.dashboardOverflow > 1 || item.reportsOverflow > 1);
  if (bad.length) {
    throw new Error(`Horizontal overflow detected: ${JSON.stringify(bad)}`);
  }
}

main().catch((error) => {
  console.error(error && error.stack ? error.stack : error);
  process.exit(1);
});
