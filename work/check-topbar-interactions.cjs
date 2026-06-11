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

async function horizontalOverflow(page) {
  return page.evaluate(() => {
    const documentOverflow = document.documentElement.scrollWidth - document.documentElement.clientWidth;
    const bodyOverflow = document.body.scrollWidth - document.body.clientWidth;
    return Math.max(documentOverflow, bodyOverflow);
  });
}

async function main() {
  await waitForHttp("http://localhost:3000/dashboard");

  const { chromium } = require(playwrightPackage);
  const executablePath = fs.existsSync(chromePath) ? chromePath : edgePath;
  const browser = await chromium.launch({ executablePath, headless: true });
  const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });

  await page.addInitScript(() => {
    window.localStorage.setItem("assetIntegrityAuth", "true");
    window.localStorage.setItem("assetIntegritySidebarCollapsed", "false");
    window.localStorage.setItem("assetIntegrityTheme", "light");
  });

  await page.goto("http://localhost:3000/dashboard", { waitUntil: "networkidle" });
  await page.getByLabel("Summary KPI cards").getByText("Total Assets").waitFor({ timeout: 30000 });

  const topbarText = await page.locator("header").innerText();
  if (/ASSET INTEGRITY|Asset Integrity Management/.test(topbarText)) {
    throw new Error("Topbar still contains the application title.");
  }

  await page.getByRole("button", { name: /Project \/ Site/ }).click();
  await page.getByRole("button", { name: "Offshore Platform Alpha" }).click();
  await page.getByRole("button", { name: /Offshore Platform Alpha/ }).waitFor({ timeout: 30000 });

  await page.getByRole("button", { name: "Notifications" }).click();
  await page.getByText("Overdue inspection detected").waitFor({ timeout: 30000 });
  await page.getByRole("button", { name: "Notifications" }).click();

  await page.getByRole("button", { name: "Switch to night mode" }).click();
  await page.waitForFunction(() => window.localStorage.getItem("assetIntegrityTheme") === "dark");
  const themeState = await page.evaluate(() => {
    const main = document.querySelector("main");
    const sidebar = document.querySelector("aside");
    return {
      mainClass: main?.className ?? "",
      mainBackground: main ? window.getComputedStyle(main).backgroundColor : "",
      sidebarBackground: sidebar ? window.getComputedStyle(sidebar).backgroundColor : ""
    };
  });

  if (!themeState.mainClass.includes("main-theme-dark")) {
    throw new Error("Dark theme class was not applied to main content.");
  }

  await page.screenshot({ path: path.join(root, "outputs", "topbar-dark-1366.png"), fullPage: true });

  await page.getByRole("button", { name: "User menu" }).click();
  await page.getByText("Account Settings").waitFor({ timeout: 30000 });
  await page.getByRole("button", { name: "Logout" }).click();
  await page.waitForURL("**/login", { timeout: 30000 });

  const overflow = await horizontalOverflow(page);
  await page.close();
  await browser.close();

  if (overflow > 1) {
    throw new Error(`Topbar flow overflowed horizontally by ${overflow}px.`);
  }

  console.log(JSON.stringify({ projectSelection: "ok", notifications: "ok", darkMode: themeState, logout: "ok", overflow }, null, 2));
}

main().catch((error) => {
  console.error(error && error.stack ? error.stack : error);
  process.exit(1);
});
