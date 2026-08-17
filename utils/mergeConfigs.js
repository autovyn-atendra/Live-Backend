const fs = require('fs');
const path = require('path');

const CONFIG_DIR = path.join(__dirname, '../config');
const BACKUP_DIR = path.join(__dirname, '../backup_config');
const MERGED_PATH = path.join(CONFIG_DIR, 'config.json');

const BUNDLE_RE = /^config-.+\.json$/;
const BAK_RE = /^config\.json\.bak\.\d+$/;

// One-time cleanup: sweep any bundle/backup files still sitting directly in
// config/ (e.g. from before this folder existed) into backup_config/.
function migrateLegacyFiles() {
  let entries;
  try {
    entries = fs.readdirSync(CONFIG_DIR);
  } catch (e) {
    return;
  }

  for (const name of entries) {
    if (!BUNDLE_RE.test(name) && !BAK_RE.test(name)) continue;
    const from = path.join(CONFIG_DIR, name);
    const to = path.join(BACKUP_DIR, name);
    try {
      fs.renameSync(from, to);
      console.log(`[config-merge] Moved ${name} → backup_config/`);
    } catch (e) {
      console.warn(`[config-merge] Failed to move ${name} to backup_config/: ${e.message}`);
    }
  }
}

function mergeAllBundles() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
  migrateLegacyFiles();

  let files;
  try {
    files = fs.readdirSync(BACKUP_DIR)
      .filter(f => BUNDLE_RE.test(f))
      .map(f => {
        const fullPath = path.join(BACKUP_DIR, f);
        return { name: f, fullPath, mtime: fs.statSync(fullPath).mtimeMs };
      })
      .sort((a, b) => b.mtime - a.mtime); // newest first — newest wins on conflict
  } catch (e) {
    console.error('[config-merge] Failed to scan backup_config directory:', e.message);
    return;
  }

  if (files.length === 0) {
    console.log('[config-merge] No bundle files found — skipping merge.');
    return;
  }

  const merged = {};

  for (const file of files) {
    let bundle;
    try {
      bundle = JSON.parse(fs.readFileSync(file.fullPath, 'utf8'));
    } catch (e) {
      console.warn(`[config-merge] Skipping ${file.name} — parse error: ${e.message}`);
      continue;
    }

    if (!bundle.privateKey || typeof bundle.configs !== 'object') {
      console.warn(`[config-merge] Skipping ${file.name} — missing privateKey or configs`);
      continue;
    }

    for (const [dlrId, dbConfig] of Object.entries(bundle.configs)) {
      const key = dlrId.toUpperCase();
      if (merged[key]) {
        // Already set by a newer file — skip duplicate
        continue;
      }
      merged[key] = { ...dbConfig, _key: bundle.privateKey };
    }
  }

  if (Object.keys(merged).length === 0) {
    console.log('[config-merge] No valid DB entries found in bundles — skipping write.');
    return;
  }

  const output = JSON.stringify(merged, null, 2) + '\n';

  if (fs.existsSync(MERGED_PATH)) {
    const existing = fs.readFileSync(MERGED_PATH, 'utf8');
    if (existing === output) {
      console.log('[config-merge] config.json already up to date — skipping write.');
      return;
    }
    fs.copyFileSync(MERGED_PATH, path.join(BACKUP_DIR, `config.json.bak.${Date.now()}`));
  }

  fs.writeFileSync(MERGED_PATH, output, 'utf8');
  console.log(`[config-merge] ${Object.keys(merged).length} DB entries merged from ${files.length} bundle(s) → config.json`);
}

module.exports = { mergeAllBundles };
