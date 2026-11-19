// Servidor estático mínimo para Railway (sin dependencias).
const http = require("http");
const fs = require("fs");
const path = require("path");

const RAIZ = __dirname;
const PUERTO = process.env.PORT || 3000;
const TIPOS = {
  ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".gif": "image/gif", ".webp": "image/webp",
  ".mp4": "video/mp4", ".webm": "video/webm", ".woff2": "font/woff2", ".woff": "font/woff",
  ".json": "application/json", ".svg": "image/svg+xml", ".ico": "image/x-icon", ".txt": "text/plain; charset=utf-8",
};

http.createServer((req, res) => {
  let ruta;
  try { ruta = decodeURIComponent(req.url.split("?")[0]); } catch { res.writeHead(400); return res.end("Solicitud inválida"); }
  if (ruta.endsWith("/")) ruta += "index.html";
  const archivo = path.normalize(path.join(RAIZ, ruta));
  // no salir de la carpeta del sitio
  if (!archivo.startsWith(RAIZ + path.sep) && archivo !== RAIZ) { res.writeHead(403); return res.end("Prohibido"); }

  fs.stat(archivo, (err, st) => {
    if (err || !st.isFile()) { res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }); return res.end("No encontrado"); }
    res.writeHead(200, {
      "Content-Type": TIPOS[path.extname(archivo).toLowerCase()] || "application/octet-stream",
      "Content-Length": st.size,
      "Cache-Control": "public, max-age=3600",
      "X-Content-Type-Options": "nosniff",
    });
    fs.createReadStream(archivo).pipe(res);
  });
}).listen(PUERTO, () => console.log("Sitio en puerto " + PUERTO));
