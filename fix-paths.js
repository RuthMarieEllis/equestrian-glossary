const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'dist', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');
html = html.replace(/src="\/_expo\//g, 'src="/equestrian-glossary/_expo/');
html = html.replace(/href="\/_expo\//g, 'href="/equestrian-glossary/_expo/');
fs.writeFileSync(indexPath, html);
console.log('Paths fixed in dist/index.html');
