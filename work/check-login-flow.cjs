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
  { name: "login-1920", width: 1920, height: 1080 },
  { name: "login-1440", width: 1440, height: 900 },
  { name: "login-1366", width: 1366, height: 768 },
  { name: "login-1280", width: 1280, height: 720 },
  { name: "login-tablet", width: 768, height: 1024 },
  { name: "login-mobile", width: 390, height: 844 }
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

function overflowMetrics() {
  return {
    documentClientWidth: document.documentElement.clientWidth,
    documentScrollWidth: document.documentElement.scrollWidth,
    bodyClientWidth: document.body.clientWidth,
    bodyScrollWidth: document.body.scrollWidth
  };
}

async function main() {
  await waitForHttp("http://localhost:3000/login");

  const { chromium } = require(playwrightPackage);
  const executablePath = fs.existsSync(chromePath) ? chromePath : edgePath;
  const browser = await chromium.launch({ executablePath, headless: true });

  const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  await page.goto("http://localhost:3000/login", { waitUntil: "networkidle" });
  await page.getByRole("heading", { name: "Welcome Back" }).waitFor({ timeout: 30000 });

  await page.getByRole("button", { name: "Sign in with Single Sign-On (SSO)" }).click();
  await page.getByText("SSO is not available in this prototype.").waitFor({ timeout: 5000 });

  const passwordInput = page.locator("#password");
  if ((await passwordInput.getAttribute("type")) !== "password") {
    throw new Error("Password input should be masked initially.");
  }
  await page.getByRole("button", { name: "Show password" }).click();
  if ((await passwordInput.getAttribute("type")) !== "text") {
    throw new Error("Password visibility toggle did not reveal the password.");
  }
  await page.getByRole("button", { name: "Hide password" }).click();
  if ((await passwordInput.getAttribute("type")) !== "password") {
    throw new Error("Password visibility toggle did not hide the password.");
  }

  await page.getByLabel("Email / Username").fill("wrong");
  await passwordInput.fill("wrong");
  await page.getByRole("button", { name: "Sign In", exact: true }).click();
  await page.getByText("Invalid email/username or password.").waitFor({ timeout: 5000 });

  await page.getByLabel("Email / Username").fill("superadmin");
  await passwordInput.fill("superadmin");
  await page.getByRole("button", { name: "Sign In", exact: true }).click();
  await page.waitForURL("**/dashboard", { timeout: 10000 });
  await page.getByLabel("Summary KPI cards").getByText("Total Assets").waitFor({ timeout: 30000 });

  await page.getByRole("button", { name: "User menu" }).click();
  await page.getByRole("button", { name: "Logout" }).click();
  await page.waitForURL("**/login", { timeout: 10000 });

  const responsiveResults = [];
  for (const viewport of viewports) {
    const testPage = await browser.newPage({ viewport });
    await testPage.goto("http://localhost:3000/login", { waitUntil: "networkidle" });
    await testPage.getByRole("heading", { name: "Welcome Back" }).waitFor({ timeout: 30000 });
    const metrics = await testPage.evaluate(overflowMetrics);
    const overflow = Math.max(
      metrics.documentScrollWidth - metrics.documentClientWidth,
      metrics.bodyScrollWidth - metrics.bodyClientWidth
    );
    if (["login-1366", "login-1280", "login-mobile"].includes(viewport.name)) {
      await testPage.screenshot({
        path: path.join(root, "outputs", `${viewport.name}.png`),
        fullPage: true
      });
    }
    responsiveResults.push({ ...viewport, overflow, ...metrics });
    await testPage.close();
  }

  await browser.close();

  console.log(JSON.stringify({ flow: "ok", responsiveResults }, null, 2));
  const bad = responsiveResults.filter((result) => result.overflow > 1);
  if (bad.length > 0) {
    throw new Error(`Login horizontal overflow detected: ${bad.map((item) => `${item.name}:${item.overflow}`).join(", ")}`);
  }
}

main().catch((error) => {
  console.error(error && error.stack ? error.stack : error);
  process.exit(1);
});
