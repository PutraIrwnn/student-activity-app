import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const src = String.raw`C:\Users\PUTRA\.gemini\antigravity\brain\d3446bf2-6e70-4b8f-9712-a6d95630c213\student_app_logo_1765189511638.png`;
const destDir = path.resolve(__dirname, 'public');
const dest = path.resolve(destDir, 'icon.png');
const destPwa192 = path.resolve(destDir, 'pwa-192x192.png');
const destPwa512 = path.resolve(destDir, 'pwa-512x512.png');
const destApple = path.resolve(destDir, 'apple-touch-icon.png');

const log = [];
log.push(`Time: ${new Date().toISOString()}`);
log.push(`Source: ${src}`);
log.push(`Dest Dir: ${destDir}`);

try {
  if (!fs.existsSync(destDir)) {
      log.push("Creating public dir...");
      fs.mkdirSync(destDir, { recursive: true });
  }

  if (fs.existsSync(src)) {
    const stats = fs.statSync(src);
    log.push(`Source exists. Size: ${stats.size} bytes`);
    
    // Copy function
    const doCopy = (target) => {
        try {
            fs.copyFileSync(src, target);
            log.push(`SUCCESS: Copied to ${target}`);
        } catch(e) {
            log.push(`FAILED: ${target} - ${e.message}`);
        }
    };

    doCopy(dest);
    doCopy(destPwa192);
    doCopy(destPwa512);
    doCopy(destApple);

  } else {
    log.push("CRITICAL: Source DOES NOT EXIST at path.");
    // Try listing parent dir of source
    try {
        const parent = path.dirname(src);
        log.push(`Listing parent (${parent}):`);
        const files = fs.readdirSync(parent);
        log.push(files.join(', '));
    } catch(e) {
        log.push(`Cannot list parent: ${e.message}`);
    }
  }
} catch (e) {
  log.push(`General Runtime Error: ${e.message}`);
}

fs.writeFileSync('debug_result.txt', log.join('\n'));
console.log("Debug script finished");
