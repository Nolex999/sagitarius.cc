const fs = require('fs');
const path = require('path');

const r6Path = path.join(__dirname, '..', 'src', 'assets', 'bin', 'SagitariusR6.dat');
const externalPath = path.join(__dirname, '..', 'src', 'assets', 'bin', 'SagitariusExternal.dat');
const outputPath = path.join(__dirname, '..', 'src', 'assets', 'loaders.ts');

if (!fs.existsSync(r6Path) || !fs.existsSync(externalPath)) {
    console.error('Binaries not found!');
    process.exit(1);
}

const r6 = fs.readFileSync(r6Path).toString('base64');
const external = fs.readFileSync(externalPath).toString('base64');

const content = `export const R6_LOADER_BASE64 = "${r6}";\nexport const EXTERNAL_LOADER_BASE64 = "${external}";\n`;

fs.writeFileSync(outputPath, content);
console.log('Loaders bundled to src/assets/loaders.ts');
