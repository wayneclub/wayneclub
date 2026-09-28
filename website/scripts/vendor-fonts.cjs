// Usage: node scripts/vendor-fonts.cjs /path/to/node_modules
const fs = require('node:fs');
const path = require('node:path');
const modules = process.argv[2];
if (!modules) throw new Error('Pass the directory containing the Fontsource packages.');
const root = path.resolve(__dirname, '..');
let css = '';
const manifest = [];
for (const name of ['inter', 'noto-sans-tc', 'noto-sans-sc']) {
  const source = path.join(modules, '@fontsource-variable', name);
  const target = path.join(root, 'assets/fonts', name);
  fs.mkdirSync(target, {recursive:true});
  const original = fs.readFileSync(path.join(source, 'wght.css'), 'utf8');
  for (const match of original.matchAll(/url\(\.\/files\/([^)]*)\)/g)) {
    fs.copyFileSync(path.join(source, 'files', match[1]), path.join(target, match[1]));
  }
  fs.copyFileSync(path.join(source, 'LICENSE'), path.join(target, 'LICENSE'));
  css += original.replaceAll('./files/', './fonts/'+name+'/')+'\n';
  const pkg = JSON.parse(fs.readFileSync(path.join(source, 'package.json'), 'utf8'));
  manifest.push({name:pkg.name,version:pkg.version,license:pkg.license});
}
fs.writeFileSync(path.join(root, 'assets/fonts.css'), css);
fs.writeFileSync(path.join(root, 'assets/fonts/manifest.json'), JSON.stringify(manifest,null,2)+'\n');
console.log('Vendored font subsets with unicode ranges and licenses.');
