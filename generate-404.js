const fs = require('fs');

// Lies die `index.html`-Datei
const indexHtml = fs.readFileSync('dist/slack-clone/browser/index.html', 'utf8');

// Kopiere `index.html` zu `404.html`
fs.writeFileSync('dist/slack-clone/browser/404.html', indexHtml);