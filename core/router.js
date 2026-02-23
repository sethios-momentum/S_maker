// Gestionnaire de routes - s_maker
const fs = require("fs");
const path = require("path");

function handle(req, res) {
  if (req.url === "/" && req.method === "GET") {
    const filePath = path.join(__dirname, "../ui/index.html");
    const html = fs.readFileSync(filePath);
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(html);
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Page non trouvée");
  }
}

module.exports = { handle };