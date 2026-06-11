import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const outDir = path.join(rootDir, "out");

async function collectHtmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await collectHtmlFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      files.push(fullPath);
    }
  }

  return files;
}

async function collectWebpackRuntimeFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await collectWebpackRuntimeFiles(fullPath));
    } else if (entry.isFile() && /^webpack-[\w-]+\.js$/.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

function prefixForHtmlFile(filePath) {
  const fromDir = path.dirname(filePath);
  const relative = path.relative(fromDir, outDir).replace(/\\/g, "/");
  return relative ? `${relative}/` : "./";
}

function rewriteHtml(content, prefix) {
  const assetPrefix = prefix === "./" ? "." : prefix.replace(/\/$/, "");

  return content
    .replace(/(href|src)="\/(_next\/[^"]+)"/g, `$1="${prefix}$2"`)
    .replace(/(href|src)="\/(images\/[^"]+)"/g, `$1="${prefix}$2"`)
    .replace(/(href|src)="\/(favicon[^"]*)"/g, `$1="${prefix}$2"`)
    .replace(/"\/_next\//g, `"${prefix}_next/`)
    .replace(/'\/_next\//g, `'${prefix}_next/`)
    .replace(/url\(\s*\/(_next\/[^)]+)\)/g, `url(${prefix}$1)`)
    .replace(/\\"assetPrefix\\":\\"\\"/g, `\\"assetPrefix\\":\\"${assetPrefix}\\"`)
    .replace(/"assetPrefix":""/g, `"assetPrefix":"${assetPrefix}"`);
}

function rewriteWebpackRuntime(content) {
  const runtimePublicPath =
    'd.p=function(){var e=document.currentScript&&document.currentScript.src;if(e)return new URL("../../",e).href;var t=document.querySelector("script[src*=\'_next/static/chunks/webpack-\']");return t?new URL("../../",t.src).href:"_next/"}()';

  return content.replace(/d\.p="\/_next\/"/g, runtimePublicPath);
}

async function main() {
  const files = await collectHtmlFiles(outDir);
  const runtimeFiles = await collectWebpackRuntimeFiles(path.join(outDir, "_next", "static", "chunks"));

  await Promise.all(
    files.map(async (filePath) => {
      const content = await readFile(filePath, "utf8");
      const rewritten = rewriteHtml(content, prefixForHtmlFile(filePath));

      if (rewritten !== content) {
        await writeFile(filePath, rewritten, "utf8");
      }
    })
  );

  await Promise.all(
    runtimeFiles.map(async (filePath) => {
      const content = await readFile(filePath, "utf8");
      const rewritten = rewriteWebpackRuntime(content);

      if (rewritten !== content) {
        await writeFile(filePath, rewritten, "utf8");
      }
    })
  );

  console.log(`Rewrote static asset paths for ${files.length} HTML files and ${runtimeFiles.length} webpack runtime file(s).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
