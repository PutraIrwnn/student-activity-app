import fs from 'fs';
import path from 'path';

// Double backslashes for JS string visual clarity, though String.raw used previously was fine.
// Let's use forward slashes for safety in JS.
const sourceFile = "C:/Users/PUTRA/.gemini/antigravity/brain/d3446bf2-6e70-4b8f-9712-a6d95630c213/student_app_logo_1765189511638.png";
const destFolder = "public"; 

console.log("--- DIAGNOSTIC START ---");
console.log(`CWD: ${process.cwd()}`);
console.log(`Checking Source: ${sourceFile}`);

if (fs.existsSync(sourceFile)) {
    console.log("PASS: Source file exists.");
    const stats = fs.statSync(sourceFile);
    console.log(`Source File Size: ${stats.size} bytes`);
} else {
    console.error("FAIL: Source file DOES NOT EXIST.");
    console.log("Listing parent dir of source:");
    const parent = path.dirname(sourceFile);
    try {
        console.log(fs.readdirSync(parent));
    } catch (e) { console.error("Cannot list parent dir", e); }
    process.exit(1);
}

if (!fs.existsSync(destFolder)) {
    console.log(`Creating directory: ${destFolder}`);
    fs.mkdirSync(destFolder, { recursive: true });
}

const targets = [
  'icon.png',
  'pwa-192x192.png',
  'pwa-512x512.png',
  'apple-touch-icon.png'
];

targets.forEach(fileName => {
    const destPath = path.join(destFolder, fileName);
    try {
        fs.copyFileSync(sourceFile, destPath);
        console.log(`OK: Copied to ${destPath}`);
    } catch (err) {
        console.error(`ERR: Failed copying to ${destPath}`, err);
    }
});

console.log("--- DIAGNOSTIC END ---");
