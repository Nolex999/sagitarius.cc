const fs = require('fs');
const path = require('path');

const faceitPath = path.join(__dirname, '..', 'src', 'assets', 'bin', 'SagitariusFaceit.dat');
const externalPath = path.join(__dirname, '..', 'src', 'assets', 'bin', 'SagitariusExternal.dat');
const outputPath = path.join(__dirname, '..', 'src', 'assets', 'loaders.ts');

if (!fs.existsSync(faceitPath) || !fs.existsSync(externalPath)) {
    console.error('Binaries not found!');
    process.exit(1);
}

const faceit = fs.readFileSync(faceitPath).toString('base64');
const external = fs.readFileSync(externalPath).toString('base64');

const content = `export const FACEIT_LOADER_BASE64 = "${faceit}";\nexport const EXTERNAL_LOADER_BASE64 = "${external}";\n`;

fs.writeFileSync(outputPath, content);
console.log('Loaders bundled to src/assets/loaders.ts');
