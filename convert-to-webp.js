/**
 * convert-to-webp.js
 * Converts all JPEG/PNG images in public/ to WebP,
 * then updates all references in HTML/CSS files.
 */

const sharp = require('sharp');
const fs    = require('fs');
const path  = require('path');

const PUBLIC_DIR = path.join(__dirname, 'public');

// Files & folders to update references in
const TEXT_EXTS = ['.html', '.css', '.js', '.xml'];

// Images to skip (logos / icons that must stay PNG for transparency)
const SKIP = new Set(['vaapi-logo.png']);

async function main() {
  const files = fs.readdirSync(PUBLIC_DIR);
  const images = files.filter(f => {
    const ext = path.extname(f).toLowerCase();
    return ['.jpg', '.jpeg', '.png'].includes(ext) && !SKIP.has(f);
  });

  console.log(`\nFound ${images.length} images to convert:\n`);

  const conversions = []; // [{from, to, fromName, toName}]

  for (const img of images) {
    const fromPath = path.join(PUBLIC_DIR, img);
    const toName   = img.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    const toPath   = path.join(PUBLIC_DIR, toName);

    const beforeKB = Math.round(fs.statSync(fromPath).size / 1024);

    try {
      await sharp(fromPath)
        .resize({ width: 1600, withoutEnlargement: true })
        .webp({ quality: 82, effort: 5 })
        .toFile(toPath);

      const afterKB = Math.round(fs.statSync(toPath).size / 1024);
      const saved   = Math.round((1 - afterKB / beforeKB) * 100);

      console.log(`  ✔ ${img.padEnd(35)} ${beforeKB} KB  →  ${afterKB} KB  (saved ${saved}%)`);

      conversions.push({ fromName: img, toName });

      // Remove the original JPEG/PNG
      fs.unlinkSync(fromPath);
    } catch (err) {
      console.error(`  ✘ ${img} — ${err.message}`);
    }
  }

  // ── Update references in all text files ─────────────────────────
  console.log('\nUpdating references in HTML / CSS / JS files...\n');

  const walkDirs = [PUBLIC_DIR, path.join(__dirname, 'public', 'css'), path.join(__dirname, 'public', 'js')];
  const seen = new Set();

  for (const dir of walkDirs) {
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir)) {
      const fullPath = path.join(dir, f);
      if (seen.has(fullPath) || !TEXT_EXTS.includes(path.extname(f).toLowerCase())) continue;
      seen.add(fullPath);

      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;

      for (const { fromName, toName } of conversions) {
        if (content.includes(fromName)) {
          content = content.split(fromName).join(toName);
          changed = true;
        }
      }

      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`  ✔ Updated: ${path.relative(__dirname, fullPath)}`);
      }
    }
  }

  console.log('\n✅ All done! WebP conversion complete.\n');
}

main().catch(console.error);
