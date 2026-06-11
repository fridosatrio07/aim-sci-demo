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
  { name: "about-1920", width: 1920, height: 1080 },
  { name: "about-1440", width: 1440, height: 900 },
  { name: "about-1366", width: 1366, height: 768 },
  { name: "about-1280", width: 1280, height: 720 },
  { name: "about-tablet", width: 768, height: 1024 },
  { name: "about-mobile", width: 390, height: 844 }
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
  await waitForHttp("http://localhost:3000/about-sucofindo");
  fs.mkdirSync(outputDir, { recursive: true });

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
      window.localStorage.removeItem("assetIntegrityAboutPageConfig");
      window.localStorage.removeItem("assetIntegrityAboutContactConfig");
    });
    await page.goto("http://localhost:3000/about-sucofindo", { waitUntil: "networkidle" });
    await page.getByRole("heading", { name: "About SUCOFINDO" }).waitFor({ timeout: 30000 });
    await page.getByText("SBU Aset dan Energi Baru Terbarukan", { exact: true }).waitFor({ timeout: 30000 });
    await page.getByRole("heading", { name: "Contact Information" }).waitFor({ timeout: 30000 });
    await page.getByRole("button", { name: "View Brochure" }).waitFor({ timeout: 30000 });

    if (viewport.name === "about-1366") {
      await page.getByRole("button", { name: "Customize About Page" }).click();
      await page.getByRole("dialog", { name: "Customize About Page" }).waitFor({ timeout: 30000 });
      await page.getByRole("button", { name: "Add Panel" }).click();
      await page.getByLabel("Panel Title").last().fill("Prototype Custom Panel");
      await page.getByLabel("Body Text").last().fill("This panel verifies frontend-only content customization.");
      await page.getByRole("button", { name: "Save Prototype Changes" }).click();
      await page.getByText("Prototype Custom Panel").waitFor({ timeout: 30000 });

      await page.getByRole("button", { name: "Edit Contact Information" }).click();
      await page.getByRole("dialog", { name: "Edit Contact Information" }).waitFor({ timeout: 30000 });
      await page.getByLabel("Office Label").fill("SUCOFINDO Branch Office");
      await page.getByLabel("Branch / City").fill("Bandung");
      await page.getByRole("button", { name: "Save Contact Information" }).click();
      await page.getByText("SUCOFINDO Branch Office").waitFor({ timeout: 30000 });
      await page.getByText("Bandung").waitFor({ timeout: 30000 });

      await page.getByRole("button", { name: "View Brochure" }).click();
      await page.getByRole("dialog", { name: "SUCOFINDO AEBT Brochure" }).waitFor({ timeout: 30000 });
      page.once("dialog", async (dialog) => {
        if (dialog.message() !== "Brochure configuration is not available in this prototype.") {
          throw new Error(`Unexpected brochure alert: ${dialog.message()}`);
        }
        await dialog.accept();
      });
      await page.getByRole("button", { name: "Upload/Configure Brochure" }).click();
      await page.getByRole("button", { name: "Close", exact: true }).click();

      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ path: path.join(outputDir, "about-1366.png"), fullPage: true });

      await page.getByRole("button", { name: "Switch to night mode" }).click();
      await page.waitForFunction(() => window.localStorage.getItem("assetIntegrityTheme") === "dark");
      const shell = await page.evaluate(() => {
        const header = document.querySelector("header");
        const main = document.querySelector("main");
        const card = document.querySelector("main section");
        return {
          header: header ? window.getComputedStyle(header).backgroundImage || window.getComputedStyle(header).backgroundColor : "",
          main: main ? window.getComputedStyle(main).backgroundColor : "",
          card: card ? window.getComputedStyle(card).backgroundColor : ""
        };
      });
      if (shell.main === "rgb(248, 250, 252)" || shell.card === "rgb(255, 255, 255)") {
        throw new Error(`Dark mode did not apply to About page content: ${JSON.stringify(shell)}`);
      }
      await page.screenshot({ path: path.join(outputDir, "about-dark-1366.png"), fullPage: true });
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
