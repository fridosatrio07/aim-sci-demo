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

async function desktopSidebarWidth(page) {
  return page.evaluate(() => {
    const sidebars = Array.from(document.querySelectorAll("aside"));
    const sidebar = sidebars.find((element) => {
      const style = window.getComputedStyle(element);
      return style.display !== "none" && style.position === "fixed";
    });

    return sidebar ? Math.round(sidebar.getBoundingClientRect().width) : 0;
  });
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

  const desktop = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  await desktop.addInitScript(() => {
    window.localStorage.setItem("assetIntegrityAuth", "true");
    window.localStorage.setItem("assetIntegritySidebarCollapsed", "false");
  });
  await desktop.goto("http://localhost:3000/dashboard", { waitUntil: "networkidle" });
  await desktop.getByLabel("Summary KPI cards").getByText("Total Assets").waitFor({ timeout: 30000 });

  if ((await desktop.getByText("Collapse Menu").count()) !== 0) {
    throw new Error("Sidebar still contains forbidden Collapse Menu text.");
  }

  const expandedWidth = await desktopSidebarWidth(desktop);
  if (expandedWidth < 270 || expandedWidth > 290) {
    throw new Error(`Expected expanded sidebar around 280px, received ${expandedWidth}px.`);
  }

  await desktop.getByRole("button", { name: "Collapse sidebar" }).click();
  await desktop.waitForTimeout(500);
  const collapsedWidth = await desktopSidebarWidth(desktop);
  if (collapsedWidth < 72 || collapsedWidth > 88) {
    throw new Error(`Expected collapsed sidebar around 80px, received ${collapsedWidth}px.`);
  }

  await desktop.getByRole("button", { name: "Expand sidebar" }).click();
  await desktop.waitForTimeout(500);
  await desktop.getByRole("button", { name: "Risk-Based Inspection" }).click();
  const closedState = await desktop.getByRole("button", { name: "Risk-Based Inspection" }).getAttribute("aria-expanded");
  if (closedState !== "false") {
    throw new Error("Risk-Based Inspection submenu did not close.");
  }

  await desktop.getByRole("button", { name: "Risk-Based Inspection" }).click();
  await desktop.getByRole("link", { name: "Inspection Plan" }).click();
  await desktop.waitForURL("**/risk-based-inspection/inspection-plan", { timeout: 30000 });
  await desktop.getByRole("heading", { name: "Inspection Plan" }).waitFor({ timeout: 30000 });
  const desktopOverflow = await horizontalOverflow(desktop);
  if (desktopOverflow > 1) {
    throw new Error(`Desktop sidebar route overflowed horizontally by ${desktopOverflow}px.`);
  }

  await desktop.screenshot({ path: path.join(root, "outputs", "sidebar-1366-expanded.png"), fullPage: true });
  await desktop.close();

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobile.addInitScript(() => {
    window.localStorage.setItem("assetIntegrityAuth", "true");
    window.localStorage.setItem("assetIntegritySidebarCollapsed", "false");
  });
  await mobile.goto("http://localhost:3000/dashboard", { waitUntil: "networkidle" });
  await mobile.getByRole("button", { name: "Open navigation menu" }).click();
  await mobile.getByRole("button", { name: "Helpdesk" }).waitFor({ timeout: 30000 });
  await mobile.screenshot({ path: path.join(root, "outputs", "sidebar-mobile-drawer.png"), fullPage: true });
  await mobile.getByRole("link", { name: "Create Ticket" }).click();
  await mobile.waitForURL("**/helpdesk/create-ticket", { timeout: 30000 });
  await mobile.getByRole("heading", { name: "Create Ticket" }).waitFor({ timeout: 30000 });
  const mobileOverflow = await horizontalOverflow(mobile);
  if (mobileOverflow > 1) {
    throw new Error(`Mobile placeholder route overflowed horizontally by ${mobileOverflow}px.`);
  }
  await mobile.close();

  await browser.close();

  console.log(
    JSON.stringify(
      {
        desktop: { expandedWidth, collapsedWidth, overflow: desktopOverflow },
        mobile: { drawerNavigation: "ok", overflow: mobileOverflow }
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error && error.stack ? error.stack : error);
  process.exit(1);
});
