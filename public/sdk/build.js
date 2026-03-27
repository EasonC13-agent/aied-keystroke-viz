// Build script - minify core and combined (core + qualtrics adapter) to dist/
const fs = require('fs');
const path = require('path');

function minify(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, '')   // block comments
    .replace(/\/\/.*$/gm, '')            // line comments
    .replace(/\n\s*\n/g, '\n')           // blank lines
    .replace(/^\s+/gm, '')              // leading whitespace
    .trim();
}

const distDir = path.join(__dirname, 'dist');
fs.mkdirSync(distDir, { recursive: true });

// 1. Core only
const coreSrc = fs.readFileSync(path.join(__dirname, 'src', 'core.js'), 'utf8');
const coreMin = minify(coreSrc);
fs.writeFileSync(path.join(distDir, 'keystroke-core.min.js'), coreMin);
console.log(`Built dist/keystroke-core.min.js (${coreMin.length} bytes)`);

// 2. Qualtrics adapter only
const qualtricsSrc = fs.readFileSync(path.join(__dirname, 'adapters', 'qualtrics', 'header.js'), 'utf8');
const qualtricsMin = minify(qualtricsSrc);
fs.writeFileSync(path.join(distDir, 'keystroke-qualtrics.min.js'), qualtricsMin);
console.log(`Built dist/keystroke-qualtrics.min.js (${qualtricsMin.length} bytes)`);

// 3. Combined: core + qualtrics adapter (backwards compatible single-file)
const combined = coreSrc + '\n\n' + qualtricsSrc.replace(
  /if \(typeof window\.KeystrokeTracker[\s\S]*?console\.warn\([^)]+\);\n\}/,
  '// Core is bundled above'
);
const combinedMin = minify(combined);
fs.writeFileSync(path.join(distDir, 'keystroke-tracker.min.js'), combinedMin);
console.log(`Built dist/keystroke-tracker.min.js (${combinedMin.length} bytes)`);

// 4. Also keep the original src for module usage
const legacySrc = fs.readFileSync(path.join(__dirname, 'src', 'keystroke-tracker.js'), 'utf8');
const legacyMin = minify(legacySrc);
fs.writeFileSync(path.join(distDir, 'keystroke-tracker-legacy.min.js'), legacyMin);
console.log(`Built dist/keystroke-tracker-legacy.min.js (${legacyMin.length} bytes) [v1 compat]`);
