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
    return Math.max(
      document.documentElement.scrollWidth - document.documentElement.clientWidth,
      document.body.scrollWidth - document.body.clientWidth
    );
  });
}

async function createContext(browser, colorScheme, auth = false) {
  const localStorage = auth
    ? [
        { name: "assetIntegrityAuth", value: "true" },
        {
          name: "assetIntegrityUser",
          value: JSON.stringify({
            username: "superadmin",
            name: "Budi Santoso",
            role: "Superadmin",
            organization: "SUCOFINDO"
          })
        },
        { name: "assetIntegrityRememberMe", value: "true" },
        { name: "assetIntegrityLoginAt", value: String(Date.now()) }
      ]
    : [];

  return browser.newContext({
    colorScheme,
    viewport: { width: 1366, height: 768 },
    storageState: {
      cookies: [],
      origins: [
        {
          origin: "http://localhost:3000",
          localStorage
        }
      ]
    }
  });
}

async function getThemeState(page) {
  return page.evaluate(() => ({
    classDark: document.documentElement.classList.contains("dark"),
    theme: document.documentElement.dataset.theme,
    source: document.documentElement.dataset.themeSource,
    bodyBg: getComputedStyle(document.body).backgroundColor
  }));
}

async function main() {
  await waitForHttp("http://localhost:3000/login");

  const { chromium } = require(playwrightPackage);
  const executablePath = fs.existsSync(chromePath) ? chromePath : edgePath;
  const browser = await chromium.launch({ executablePath, headless: true });

  const darkLoginContext = await createContext(browser, "dark", false);
  const darkLogin = await darkLoginContext.newPage();
  await darkLogin.goto("http://localhost:3000/login", { waitUntil: "domcontentloaded" });
  await darkLogin.getByRole("heading", { name: "Welcome Back" }).waitFor({ timeout: 30000 });
  let theme = await getThemeState(darkLogin);
  if (!theme.classDark || theme.theme !== "dark" || theme.bodyBg === "rgb(248, 250, 252)") {
    throw new Error(`Login did not follow dark system theme: ${JSON.stringify(theme)}`);
  }
  if ((await overflow(darkLogin)) > 1) {
    throw new Error("Dark login page has horizontal overflow.");
  }
  await darkLogin.emulateMedia({ colorScheme: "light" });
  await darkLogin.waitForFunction(() => document.documentElement.dataset.theme === "light");
  await darkLoginContext.close();

  const lightLoginContext = await createContext(browser, "light", false);
  const lightLogin = await lightLoginContext.newPage();
  await lightLogin.goto("http://localhost:3000/login", { waitUntil: "domcontentloaded" });
  await lightLogin.getByRole("heading", { name: "Welcome Back" }).waitFor({ timeout: 30000 });
  theme = await getThemeState(lightLogin);
  if (theme.classDark || theme.theme !== "light") {
    throw new Error(`Login did not follow light system theme: ${JSON.stringify(theme)}`);
  }
  await lightLoginContext.close();

  const appContext = await createContext(browser, "dark", true);
  const app = await appContext.newPage();
  await app.goto("http://localhost:3000/dashboard", { waitUntil: "networkidle" });
  await app.getByLabel("Summary KPI cards").getByText("Total Assets").waitFor({ timeout: 30000 });
  theme = await getThemeState(app);
  if (!theme.classDark || theme.theme !== "dark") {
    throw new Error(`Authenticated app did not follow dark system theme: ${JSON.stringify(theme)}`);
  }

  const headerAlignment = await app.evaluate(() => {
    const topbar = document.querySelector("header");
    const sidebarHeader = document.querySelector("aside.hidden > div > div");
    const topbarRect = topbar?.getBoundingClientRect();
    const sidebarHeaderRect = sidebarHeader?.getBoundingClientRect();
    return {
      topbarHeight: topbarRect?.height ?? 0,
      sidebarHeaderHeight: sidebarHeaderRect?.height ?? 0,
      topbarTop: topbarRect?.top ?? -1,
      sidebarHeaderTop: sidebarHeaderRect?.top ?? -1,
      sidebarHeaderText: sidebarHeader?.textContent ?? ""
    };
  });
  if (Math.abs(headerAlignment.topbarHeight - headerAlignment.sidebarHeaderHeight) > 1) {
    throw new Error(`Topbar/sidebar header heights differ: ${JSON.stringify(headerAlignment)}`);
  }
  if (!headerAlignment.sidebarHeaderText.includes("Assuring Quality, Protecting Trust")) {
    throw new Error(`Sidebar tagline missing: ${JSON.stringify(headerAlignment)}`);
  }

  await app.getByRole("button", { name: "Switch to light mode" }).click();
  await app.waitForFunction(() => localStorage.getItem("assetIntegrityThemeSource") === "manual");
  theme = await getThemeState(app);
  const storedManual = await app.evaluate(() => ({
    theme: localStorage.getItem("assetIntegrityTheme"),
    source: localStorage.getItem("assetIntegrityThemeSource")
  }));
  if (theme.classDark || storedManual.theme !== "light" || storedManual.source !== "manual") {
    throw new Error(`Manual light override failed: ${JSON.stringify({ theme, storedManual })}`);
  }
  await app.goto("http://localhost:3000/about-sucofindo", { waitUntil: "networkidle" });
  await app.getByRole("heading", { name: "About SUCOFINDO" }).waitFor({ timeout: 30000 });
  theme = await getThemeState(app);
  if (theme.classDark || theme.theme !== "light") {
    throw new Error(`Manual theme did not persist across navigation: ${JSON.stringify(theme)}`);
  }
  await appContext.close();

  const modalViewports = [
    { width: 1366, height: 768, name: "desktop" },
    { width: 768, height: 1024, name: "tablet" },
    { width: 390, height: 844, name: "mobile" }
  ];
  for (const viewport of modalViewports) {
    const context = await createContext(browser, "dark", true);
    const page = await context.newPage();
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("http://localhost:3000/about-sucofindo", { waitUntil: "networkidle" });
    await page.getByRole("heading", { name: "About SUCOFINDO" }).waitFor({ timeout: 30000 });
    await page.getByRole("button", { name: "Edit Contact Information" }).scrollIntoViewIfNeeded();
    await page.getByRole("button", { name: "Edit Contact Information" }).click();
    await page.getByRole("dialog", { name: "Edit Contact Information" }).waitFor({ timeout: 30000 });
    const saveButton = page.getByRole("button", { name: "Save Contact Information" });
    await saveButton.waitFor({ timeout: 5000 });
    const visible = await saveButton.evaluate((button) => {
      const rect = button.getBoundingClientRect();
      return rect.top >= 0 && rect.bottom <= window.innerHeight && rect.left >= 0 && rect.right <= window.innerWidth;
    });
    if (!visible) {
      throw new Error(`Save Contact Information is not visible in ${viewport.name} viewport.`);
    }
    if ((await overflow(page)) > 1) {
      throw new Error(`Horizontal overflow in ${viewport.name} contact modal.`);
    }
    await context.close();
  }

  await browser.close();
  console.log(JSON.stringify({ themeLayout: "ok" }, null, 2));
}

main().catch((error) => {
  console.error(error && error.stack ? error.stack : error);
  process.exit(1);
});
