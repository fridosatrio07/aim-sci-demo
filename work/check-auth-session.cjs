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

const AUTH_KEYS = [
  "assetIntegrityAuth",
  "assetIntegrityUser",
  "assetIntegrityRememberMe",
  "assetIntegrityLoginAt",
  "assetIntegrityExpiresAt",
  "assetIntegritySessionExpired"
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

async function clearAuth(page) {
  await page.evaluate((keys) => {
    keys.forEach((key) => window.localStorage.removeItem(key));
  }, AUTH_KEYS);
}

async function readAuth(page) {
  return page.evaluate((keys) => {
    return Object.fromEntries(keys.map((key) => [key, window.localStorage.getItem(key)]));
  }, AUTH_KEYS);
}

async function assertNoCheckingHang(page) {
  await page.waitForTimeout(900);
  const checkingVisible = await page.getByText("Checking secure access...").isVisible().catch(() => false);
  if (checkingVisible) {
    throw new Error("Auth guard is still showing Checking secure access after route resolution.");
  }
}

async function main() {
  await waitForHttp("http://localhost:3000/login");

  const { chromium } = require(playwrightPackage);
  const executablePath = fs.existsSync(chromePath) ? chromePath : edgePath;
  const browser = await chromium.launch({ executablePath, headless: true });
  const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });

  await page.goto("http://localhost:3000/login", { waitUntil: "networkidle" });
  await clearAuth(page);

  await page.goto("http://localhost:3000/about-sucofindo", { waitUntil: "networkidle" });
  await page.waitForURL("**/login", { timeout: 10000 });
  await page.getByRole("heading", { name: "Welcome Back" }).waitFor({ timeout: 10000 });
  await assertNoCheckingHang(page);

  await page.getByLabel("Email / Username").fill("wrong");
  await page.locator("#password").fill("wrong");
  await page.getByRole("button", { name: "Sign In", exact: true }).click();
  await page.getByText("Invalid email/username or password.").waitFor({ timeout: 5000 });

  await page.getByLabel("Email / Username").fill("superadmin");
  await page.locator("#password").fill("superadmin");
  const rememberChecked = await page.getByLabel("Remember me").isChecked();
  if (!rememberChecked) {
    await page.getByLabel("Remember me").check();
  }
  await page.getByRole("button", { name: "Sign In", exact: true }).click();
  await page.waitForURL("**/dashboard", { timeout: 10000 });
  await page.getByLabel("Summary KPI cards").getByText("Total Assets").waitFor({ timeout: 30000 });

  let auth = await readAuth(page);
  if (auth.assetIntegrityAuth !== "true" || auth.assetIntegrityRememberMe !== "true" || !auth.assetIntegrityUser || !auth.assetIntegrityLoginAt) {
    throw new Error(`Remembered login did not write the expected session keys: ${JSON.stringify(auth)}`);
  }
  if (auth.assetIntegrityExpiresAt !== null) {
    throw new Error("Remembered login should not store an expiry timestamp.");
  }

  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await page.waitForURL("**/dashboard", { timeout: 10000 });

  await page.goto("http://localhost:3000/login", { waitUntil: "networkidle" });
  await page.waitForURL("**/dashboard", { timeout: 10000 });

  await page.goto("http://localhost:3000/about-sucofindo", { waitUntil: "networkidle" });
  await page.getByRole("heading", { name: "About SUCOFINDO" }).waitFor({ timeout: 30000 });
  await assertNoCheckingHang(page);

  await page.getByRole("button", { name: "User menu" }).click();
  await page.getByRole("button", { name: "Logout" }).click();
  await page.waitForURL("**/login", { timeout: 10000 });
  auth = await readAuth(page);
  const uncleared = Object.entries(auth).filter(([, value]) => value !== null);
  if (uncleared.length > 0) {
    throw new Error(`Logout did not clear all auth keys: ${JSON.stringify(auth)}`);
  }

  await page.getByLabel("Email / Username").fill("superadmin");
  await page.locator("#password").fill("superadmin");
  await page.getByLabel("Remember me").uncheck();
  await page.getByRole("button", { name: "Sign In", exact: true }).click();
  await page.waitForURL("**/dashboard", { timeout: 10000 });
  auth = await readAuth(page);
  if (auth.assetIntegrityRememberMe !== "false" || !auth.assetIntegrityExpiresAt) {
    throw new Error(`Non-remembered login did not write expiry keys: ${JSON.stringify(auth)}`);
  }

  await page.evaluate(() => {
    const now = Date.now();
    window.localStorage.setItem("assetIntegrityAuth", "true");
    window.localStorage.setItem("assetIntegrityRememberMe", "false");
    window.localStorage.setItem("assetIntegrityLoginAt", String(now - 60 * 60 * 1000));
    window.localStorage.setItem("assetIntegrityExpiresAt", String(now + 350));
  });
  await page.goto("http://localhost:3000/about-sucofindo", { waitUntil: "networkidle" });
  await page.waitForURL("**/login**", { timeout: 5000 });
  await page.getByText("Your session has expired. Please sign in again.").waitFor({ timeout: 5000 });
  await assertNoCheckingHang(page);

  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await page.waitForURL("**/login", { timeout: 10000 });

  await browser.close();
  console.log(JSON.stringify({ authSession: "ok" }, null, 2));
}

main().catch((error) => {
  console.error(error && error.stack ? error.stack : error);
  process.exit(1);
});
