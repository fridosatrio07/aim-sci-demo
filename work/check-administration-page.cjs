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
  { name: "admin-1920", width: 1920, height: 1080 },
  { name: "admin-1440", width: 1440, height: 900 },
  { name: "admin-1366", width: 1366, height: 768 },
  { name: "admin-1280", width: 1280, height: 720 },
  { name: "admin-tablet", width: 768, height: 1024 },
  { name: "admin-mobile", width: 390, height: 844 }
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
  return page.evaluate(() => {
    const documentOverflow = document.documentElement.scrollWidth - document.documentElement.clientWidth;
    const bodyOverflow = document.body.scrollWidth - document.body.clientWidth;
    return Math.max(documentOverflow, bodyOverflow);
  });
}

async function main() {
  await waitForHttp("http://localhost:3000/administration");

  const { chromium } = require(playwrightPackage);
  const executablePath = fs.existsSync(chromePath) ? chromePath : edgePath;
  const browser = await chromium.launch({ executablePath, headless: true });
  const responsiveResults = [];

  for (const viewport of viewports) {
    const page = await browser.newPage({ viewport });
    await page.addInitScript(() => {
      window.localStorage.setItem("assetIntegrityAuth", "true");
      window.localStorage.setItem("assetIntegrityTheme", "light");
      window.localStorage.setItem("assetIntegritySidebarCollapsed", "false");
    });
    await page.goto("http://localhost:3000/administration", { waitUntil: "networkidle" });
    await page.getByRole("heading", { name: "Administration" }).waitFor({ timeout: 30000 });
    await page.getByText("Admin Modules").waitFor({ timeout: 30000 });
    await page.getByText("Recent Admin Activity").waitFor({ timeout: 30000 });

    if (viewport.name === "admin-1366") {
      await page.getByLabel("Module").selectOption("User Management");
      await page.getByText("Deleted user:").waitFor({ timeout: 30000 });
      page.once("dialog", async (dialog) => {
        if (dialog.message() !== "Support contact action is not available in this prototype.") {
          throw new Error(`Unexpected support alert: ${dialog.message()}`);
        }
        await dialog.accept();
      });
      await page.getByRole("button", { name: /Contact Support/ }).click();
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ path: path.join(root, "outputs", "admin-1366.png"), fullPage: true });

      await page.getByRole("button", { name: "Switch to night mode" }).click();
      await page.waitForFunction(() => window.localStorage.getItem("assetIntegrityTheme") === "dark");
      const shell = await page.evaluate(() => {
        const sidebar = Array.from(document.querySelectorAll("aside")).find((element) => {
          const style = window.getComputedStyle(element);
          return style.display !== "none";
        });
        const header = document.querySelector("header");
        const main = document.querySelector("main");
        return {
          sidebar: sidebar ? window.getComputedStyle(sidebar).backgroundColor : "",
          header: header ? window.getComputedStyle(header).backgroundImage || window.getComputedStyle(header).backgroundColor : "",
          main: main ? window.getComputedStyle(main).backgroundColor : ""
        };
      });
      if (shell.main === "rgb(248, 250, 252)" || shell.sidebar === "rgb(255, 255, 255)") {
        throw new Error(`Dark shell did not apply fully: ${JSON.stringify(shell)}`);
      }
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ path: path.join(root, "outputs", "admin-dark-1366.png"), fullPage: true });
    }

    const pageOverflow = await overflow(page);
    responsiveResults.push({ ...viewport, overflow: pageOverflow });
    await page.close();
  }

  await browser.close();

  console.log(JSON.stringify(responsiveResults, null, 2));
  const bad = responsiveResults.filter((result) => result.overflow > 1);
  if (bad.length > 0) {
    throw new Error(`Horizontal overflow detected: ${bad.map((item) => `${item.name}:${item.overflow}`).join(", ")}`);
  }
}

main().catch((error) => {
  console.error(error && error.stack ? error.stack : error);
  process.exit(1);
});
