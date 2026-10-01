import fs from 'fs';
import path from 'path';

const assetsDir = path.resolve(process.cwd(), 'drafts', 'assets');
if (fs.existsSync(assetsDir)) {
  const files = fs.readdirSync(assetsDir);
  let deletedCount = 0;
  for (const file of files) {
    if (file === 'demoly_logo.png' || file === 'image.png') {
      continue;
    }
    const fullPath = path.join(assetsDir, file);
    if (fs.statSync(fullPath).isFile()) {
      fs.unlinkSync(fullPath);
      console.log(`[CLEANUP] Deleted local temp cover: ${file}`);
      deletedCount++;
    }
  }
  console.log(`\nSuccessfully cleaned up ${deletedCount} local temp files.`);
  console.log(`Preserved core assets: demoly_logo.png, image.png`);
}
