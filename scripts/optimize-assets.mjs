import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const ASSETS_DIR = path.join(process.cwd(), 'assets', 'images');

async function convertToWebP(inputPath, outputPath, quality = 80) {
  try {
    await sharp(inputPath)
      .toFormat('webp', { quality, lossless: false })
      .toFile(outputPath);
    console.log(`✅ Converti: ${inputPath} -> ${outputPath}`);
    return true;
  } catch (err) {
    console.error(`❌ Erreur avec ${inputPath}:`, err.message);
    return false;
  }
}

async function processAssets() {
  const files = fs.readdirSync(ASSETS_DIR);
  let totalSaved = 0;
  let totalOriginal = 0;
  
  for (const file of files) {
    const inputPath = path.join(ASSETS_DIR, file);
    const ext = path.extname(file).toLowerCase();
    
    if (['.png', '.jpg', '.jpeg'].includes(ext)) {
      const stats = fs.statSync(inputPath);
      totalOriginal += stats.size;
      
      const outputPath = path.join(ASSETS_DIR, file.replace(ext, '.webp'));
      const success = await convertToWebP(inputPath, outputPath);
      
      if (success) {
        const outputStats = fs.statSync(outputPath);
        const saved = stats.size - outputStats.size;
        totalSaved += saved;
        console.log(`  Économie: ${(saved / 1024).toFixed(1)} Ko`);
      }
    }
  }
  
  console.log(`\n📊 Résumé:`);
  console.log(`  Fichiers originaux: ${(totalOriginal / 1024).toFixed(1)} Ko`);
  console.log(`  Économies: ${(totalSaved / 1024).toFixed(1)} Ko (${((totalSaved / totalOriginal) * 100).toFixed(1)}%)`);
}

processAssets().catch(console.error);
