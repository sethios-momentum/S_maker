// core/server.js

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// Chemin du dossier public (où se trouvent tes fichiers HTML/CSS/JS)
const publicDir = path.join(__dirname, '..'); // remonte d’un dossier pour atteindre Documents/s_maker

const server = http.createServer((req, res) => {
    console.log(`Requête reçue : ${req.url}`);

    // Définir le fichier à envoyer
    let filePath = path.join(publicDir, req.url === '/' ? 'index.html' : req.url);

    // Obtenir l'extension pour le type MIME
    const ext = path.extname(filePath).toLowerCase();
    let contentType = 'text/html';

    switch(ext) {
        case '.js':
            contentType = 'application/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
        case '.jpeg':
            contentType = 'image/jpeg';
            break;
        case '.gif':
            contentType = 'image/gif';
            break;
        case '.ico':
            contentType = 'image/x-icon';
            break;
    }

    // Lire le fichier et l'envoyer
    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end('404 - Not Found');
        } else {
            res.writeHead(200, {'Content-Type': contentType});
            res.end(content);
        }
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Serveur lancé sur le port ${PORT}`);
});
