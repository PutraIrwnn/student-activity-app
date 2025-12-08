import fs from 'fs';
import path from 'path';

const sources = [
    // Generated PNG
    String.raw`C:\Users\PUTRA\.gemini\antigravity\brain\d3446bf2-6e70-4b8f-9712-a6d95630c213\student_app_logo_1765189511638.png`,
    // User Uploaded JPG
    String.raw`C:\Users\PUTRA\.gemini\antigravity\brain\d3446bf2-6e70-4b8f-9712-a6d95630c213\uploaded_image_1765191119830.jpg`,
    // Fallback from robot.txt drag-drop path attempt
    String.raw`C:\Users\PUTRA\.gemini\antigravity\brain\d3446bf2-6e70-4b8f-9712-a6d95630c213\student_app_logo_1765189511638.png`
];

const destDir = 'public';
const targets = ['icon.png', 'pwa-192x192.png', 'pwa-512x512.png', 'apple-touch-icon.png'];

// 1. Ensure public dir exists
if (!fs.existsSync(destDir)) {
    console.log("Creating public dir...");
    fs.mkdirSync(destDir, { recursive: true });
}

// 2. Find valid source
let validSource = null;
for (const src of sources) {
    if (fs.existsSync(src)) {
        validSource = src;
        console.log(`Found valid source: ${src}`);
        break;
    }
}

if (!validSource) {
    console.error("NO VALID SOURCE FILE FOUND!");
    process.exit(1);
}

// 3. Copy
targets.forEach(target => {
    const destPath = path.join(destDir, target);
    try {
        fs.copyFileSync(validSource, destPath);
        console.log(`Copied to ${destPath}`);
    } catch (e) {
        console.error(`Failed to copy ${target}: ${e.message}`);
    }
});
