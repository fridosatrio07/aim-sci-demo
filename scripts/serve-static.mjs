import { createReadStream, existsSync } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const outDir = path.join(rootDir, "out");
const port = Number(process.env.PORT ?? 4173);

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp"
};

function safeJoin(baseDir, requestPath) {
  const normalized = path.normalize(decodeURIComponent(requestPath)).replace(/^(\.\.[/\\])+/, "");
  const resolved = path.join(baseDir, normalized);
  return resolved.startsWith(baseDir) ? resolved : null;
}

async function resolveFile(urlPath) {
  const cleanPath = urlPath.split("?")[0].split("#")[0];
  const candidates = [];

  const directPath = safeJoin(outDir, cleanPath);
  if (directPath) {
    candidates.push(directPath);
    candidates.push(path.join(directPath, "index.html"));
  }

  if (!path.extname(cleanPath)) {
    const htmlPath = safeJoin(outDir, `${cleanPath}.html`);
    if (htmlPath) {
      candidates.push(htmlPath);
    }
  }

  for (const candidate of candidates) {
    try {
      const fileStat = await stat(candidate);
      if (fileStat.isFile()) return candidate;
    } catch {}
  }

  const notFoundPath = path.join(outDir, "404.html");
  return existsSync(notFoundPath) ? notFoundPath : null;
}

if (!existsSync(outDir)) {
  console.error("The out/ folder does not exist. Run npm run build:static:safe first.");
  process.exit(1);
}

const server = createServer(async (request, response) => {
  try {
    const filePath = await resolveFile(request.url ?? "/");

    if (!filePath) {
      response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }

    const extension = path.extname(filePath);
    response.writeHead(filePath.endsWith("404.html") ? 404 : 200, {
      "content-type": mimeTypes[extension] ?? "application/octet-stream"
    });
    createReadStream(filePath).pipe(response);
  } catch {
    response.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
    response.end("Static preview server error");
  }
});

server.listen(port, () => {
  console.log(`Static preview available at http://localhost:${port}`);
});
