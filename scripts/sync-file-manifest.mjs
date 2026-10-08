import { readFile, writeFile } from 'node:fs/promises';

const manifest = JSON.parse(await readFile(new URL('../apps.json', import.meta.url)));
const output = `/* Generated from apps.json. Used only when opening index.html directly (file://). */\nwindow.APP_DECK_FILE_MANIFEST = ${JSON.stringify(manifest, null, 2)};\n`;
await writeFile(new URL('../assets/manifest-fallback.js', import.meta.url), output);
