const fs = require('fs');

// Lies die `index.html`-Datei
const indexHtml = fs.readFileSync('dist/slackclone/browser/index.html', 'utf8');

// Kopiere `index.html` zu `404.html`
fs.writeFileSync('dist/slackclone/browser/404.html', indexHtml);