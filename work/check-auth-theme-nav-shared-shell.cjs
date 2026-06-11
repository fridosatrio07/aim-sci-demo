const path = require("path");
const fs = require("fs");
const { spawn, spawnSync } = require("child_process");

const root = path.resolve(__dirname, "..");
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
const baseUrl = "http://localhost:3000";

const AUTH_KEYS = [
  "assetIntegrityAuth",
  "assetIntegrityUser",
  "assetIntegrityRememberMe",
  "assetIntegrityLoginAt",
  "assetIntegrityExpiresAt",
  "assetIntegritySessionExpired"
];

function startDevServer() {
  const child = spawn(process.execPath, ["node_modules/next/dist/bin/next", "dev"], {
    cwd: root,
    env: { ...process.env },
    windowsHide: true,
    stdio: ["ignore", "pipe", "pipe"]
  });

  child.stdout.on("data", (chunk) => process.stdout.write(chunk));
  child.stderr.on("data", (chunk) => process.stderr.write(chunk));

  return child;
}

function stopDevServer(child) {
  if (!child || child.killed) return;
  if (process.platform === "win32") {
    spawnSync("taskkill", ["/pid", String(child.pid), "/T", "/F"], { stdio: "ignore" });
    return;
  }
  child.kill("SIGTERM");
}

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

async function seedAuth(page, rememberMe = true) {
  await page.evaluate(
    ({ keys, remember }) => {
      keys.forEach((key) => window.localStorage.removeItem(key));
      const loginAt = Date.now();
      window.localStorage.setItem("assetIntegrityAuth", "true");
      window.localStorage.setItem(
        "assetIntegrityUser",
        JSON.stringify({
          username: "superadmin",
          name: "Budi Santoso",
          role: "Superadmin",
          organization: "SUCOFINDO"
        })
      );
      window.localStorage.setItem("assetIntegrityRememberMe", remember ? "true" : "false");
      window.localStorage.setItem("assetIntegrityLoginAt", String(loginAt));
      if (remember) {
        window.localStorage.removeItem("assetIntegrityExpiresAt");
      } else {
        window.localStorage.setItem("assetIntegrityExpiresAt", String(loginAt + 60 * 60 * 1000));
      }
    },
    { keys: AUTH_KEYS, remember: rememberMe }
  );
}

async function noCheckingVisible(page, label) {
  await page.waitForTimeout(500);
  const checkingVisible = await page.getByText("Checking secure access...").isVisible().catch(() => false);
  if (checkingVisible) {
    throw new Error(`Auth guard is still visible during ${label}.`);
  }
}

async function overflow(page) {
  return page.evaluate(() =>
    Math.max(
      document.documentElement.scrollWidth - document.documentElement.clientWidth,
      document.body.scrollWidth - document.body.clientWidth
    )
  );
}

async function readTheme(page) {
  return page.evaluate(() => ({
    dark: document.documentElement.classList.contains("dark"),
    theme: document.documentElement.dataset.theme,
    source: document.documentElement.dataset.themeSource
  }));
}

async function main() {
  const server = startDevServer();
  let browser;

  try {
    await waitForHttp(`${baseUrl}/login`);

    const { chromium } = require(playwrightPackage);
    const executablePath = fs.existsSync(chromePath) ? chromePath : edgePath;
    browser = await chromium.launch({ executablePath, headless: true });

    const darkContext = await browser.newContext({
      colorScheme: "dark",
      viewport: { width: 1366, height: 768 }
    });
    const darkLogin = await darkContext.newPage();
    await darkLogin.goto(`${baseUrl}/login`, { waitUntil: "domcontentloaded" });
    await darkLogin.getByRole("heading", { name: "Welcome Back" }).waitFor({ timeout: 30000 });
    let theme = await readTheme(darkLogin);
    if (!theme.dark || theme.theme !== "dark" || theme.source !== "system") {
      throw new Error(`Login did not follow system dark theme: ${JSON.stringify(theme)}`);
    }
    await darkContext.close();

    const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
    await page.goto(`${baseUrl}/login`, { waitUntil: "networkidle" });
    await clearAuth(page);

    await page.goto(`${baseUrl}/about-sucofindo`, { waitUntil: "networkidle" });
    await page.waitForURL("**/login", { timeout: 10000 });
    await noCheckingVisible(page, "logged-out protected route redirect");

    await page.getByLabel("Email / Username").fill("wrong");
    await page.locator("#password").fill("wrong");
    await page.getByRole("button", { name: "Sign In", exact: true }).click();
    await page.getByText("Invalid email/username or password.").waitFor({ timeout: 5000 });

    await page.getByLabel("Email / Username").fill("superadmin");
    await page.locator("#password").fill("superadmin");
    await page.getByLabel("Remember me").check();
    await page.getByRole("button", { name: "Sign In", exact: true }).click();
    await page.waitForURL("**/dashboard", { timeout: 30000 });
    await page.getByRole("heading", { name: "Dashboard" }).waitFor({ timeout: 30000 });
    await noCheckingVisible(page, "post-login dashboard render");

    const auth = await page.evaluate(() => ({
      auth: localStorage.getItem("assetIntegrityAuth"),
      remember: localStorage.getItem("assetIntegrityRememberMe"),
      expires: localStorage.getItem("assetIntegrityExpiresAt")
    }));
    if (auth.auth !== "true" || auth.remember !== "true" || auth.expires !== null) {
      throw new Error(`Remembered auth keys are incorrect: ${JSON.stringify(auth)}`);
    }

    await page.evaluate(() => {
      window.__transitionSentinel = "client-navigation";
    });
    await page.getByRole("link", { name: "Reports" }).click();
    await page.waitForURL("**/reports", { timeout: 10000 });
    await page.getByRole("heading", { name: "Reports" }).waitFor({ timeout: 30000 });
    await noCheckingVisible(page, "dashboard to reports navigation");
    const sentinel = await page.evaluate(() => window.__transitionSentinel);
    if (sentinel !== "client-navigation") {
      throw new Error("Sidebar navigation caused a full page reload instead of client navigation.");
    }

    if (!(await page.getByRole("link", { name: "RBI Information" }).isVisible().catch(() => false))) {
      await page.getByRole("button", { name: "Risk-Based Inspection" }).click();
    }
    await page.getByRole("link", { name: "RBI Information" }).waitFor({ timeout: 5000 });
    await page.getByRole("link", { name: "Risk Analytics" }).waitFor({ timeout: 5000 });
    await page.getByRole("link", { name: "Risk Register" }).waitFor({ timeout: 5000 });
    await page.getByRole("link", { name: "Risk Assessment Workspace" }).click();
    await page.waitForURL("**/risk-based-inspection/risk-assessment-workspace", { timeout: 10000 });
    await page.getByRole("heading", { name: "Risk Assessment Workspace" }).waitFor({ timeout: 30000 });
    await noCheckingVisible(page, "RBI child navigation");

    if (!(await page.getByRole("link", { name: "Inspection Information" }).isVisible().catch(() => false))) {
      await page.getByRole("button", { name: "Inspection Management" }).click();
    }
    await page.getByRole("link", { name: "Inspection Information" }).waitFor({ timeout: 5000 });
    await page.getByRole("link", { name: "Inspection Plan" }).click();
    await page.waitForURL("**/inspection-management/inspection-plan", { timeout: 10000 });
    await page.getByRole("heading", { name: "Inspection Plan" }).waitFor({ timeout: 30000 });

    const desktopOverflow = await overflow(page);
    if (desktopOverflow > 1) {
      throw new Error(`Desktop page overflowed horizontally by ${desktopOverflow}px.`);
    }

    await page.getByRole("button", { name: "Switch to night mode" }).click();
    await page.waitForFunction(() => localStorage.getItem("assetIntegrityThemeSource") === "manual");
    theme = await readTheme(page);
    const storedTheme = await page.evaluate(() => ({
      theme: localStorage.getItem("assetIntegrityTheme"),
      source: localStorage.getItem("assetIntegrityThemeSource")
    }));
    if (!theme.dark || storedTheme.theme !== "dark" || storedTheme.source !== "manual") {
      throw new Error(`Manual dark theme did not persist: ${JSON.stringify({ theme, storedTheme })}`);
    }

    await page.goto(`${baseUrl}/about-sucofindo`, { waitUntil: "networkidle" });
    await page.getByRole("heading", { name: "About SUCOFINDO" }).waitFor({ timeout: 30000 });
    await noCheckingVisible(page, "direct authenticated about route");
    theme = await readTheme(page);
    if (!theme.dark || theme.theme !== "dark") {
      throw new Error(`Manual theme did not survive navigation: ${JSON.stringify(theme)}`);
    }

    await page.getByRole("button", { name: "User menu" }).click();
    await page.getByRole("button", { name: "Logout" }).click();
    await page.waitForURL("**/login", { timeout: 10000 });
    const uncleared = await page.evaluate((keys) => keys.filter((key) => localStorage.getItem(key) !== null), AUTH_KEYS);
    if (uncleared.length) {
      throw new Error(`Logout left auth keys behind: ${uncleared.join(", ")}`);
    }

    await page.getByLabel("Email / Username").fill("superadmin");
    await page.locator("#password").fill("superadmin");
    await page.getByLabel("Remember me").uncheck();
    await page.getByRole("button", { name: "Sign In", exact: true }).click();
    await page.waitForURL("**/dashboard", { timeout: 10000 });
    await page.evaluate(() => {
      const now = Date.now();
      localStorage.setItem("assetIntegrityRememberMe", "false");
      localStorage.setItem("assetIntegrityLoginAt", String(now - 60 * 60 * 1000));
      localStorage.setItem("assetIntegrityExpiresAt", String(now + 250));
    });
    await page.goto(`${baseUrl}/reports`, { waitUntil: "networkidle" });
    await page.waitForURL("**/login**", { timeout: 5000 });
    try {
      await page.getByText("Your session has expired. Please sign in again.").waitFor({ timeout: 5000 });
    } catch (error) {
      const body = await page.locator("body").innerText().catch(() => "");
      throw new Error(`Expired session message was missing at ${page.url()}. Body: ${body.slice(0, 600)}`);
    }
    await noCheckingVisible(page, "expired session redirect");

    const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await mobile.goto(`${baseUrl}/login`, { waitUntil: "networkidle" });
    await seedAuth(mobile);
    await mobile.goto(`${baseUrl}/dashboard`, { waitUntil: "networkidle" });
    await mobile.getByRole("button", { name: "Open navigation menu" }).click();
    if (!(await mobile.getByRole("link", { name: "Inspection Schedule" }).isVisible().catch(() => false))) {
      await mobile.getByRole("button", { name: "Inspection Management" }).click();
    }
    await mobile.getByRole("link", { name: "Inspection Schedule" }).click();
    await mobile.waitForURL("**/inspection-management/inspection-schedule", { timeout: 10000 });
    await mobile.getByRole("heading", { name: "Inspection Schedule" }).waitFor({ timeout: 30000 });
    const mobileOverflow = await overflow(mobile);
    if (mobileOverflow > 1) {
      throw new Error(`Mobile route overflowed horizontally by ${mobileOverflow}px.`);
    }
    await mobile.close();

    await browser.close();
    console.log(
      JSON.stringify(
        {
          auth: "ok",
          theme: "ok",
          navigation: "ok",
          overflow: { desktop: desktopOverflow, mobile: mobileOverflow }
        },
        null,
        2
      )
    );
  } finally {
    if (browser) {
      await browser.close().catch(() => {});
    }
    stopDevServer(server);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error && error.stack ? error.stack : error);
    process.exit(1);
  });
