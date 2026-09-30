import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

export async function overlayDemolyLogo(
  baseImagePath: string,
  logoPath: string,
  outputPath?: string
): Promise<string> {
  if (!fs.existsSync(baseImagePath) || !fs.existsSync(logoPath)) {
    console.warn('[LOGO_OVERLAY] Missing base image or logo path.');
    return baseImagePath;
  }

  const outPath = outputPath || baseImagePath;
  const inputBuffer = fs.readFileSync(baseImagePath);
  const logoInputBuffer = fs.readFileSync(logoPath);

  const baseMetadata = await sharp(inputBuffer).metadata();
  const baseWidth = baseMetadata.width || 1600;
  const baseHeight = baseMetadata.height || 900;

  // Scale logo to ~18% of the banner width
  const logoTargetWidth = Math.round(baseWidth * 0.18);

  // Resize logo
  const resizedLogoBuffer = await sharp(logoInputBuffer)
    .resize({ width: logoTargetWidth, withoutEnlargement: true })
    .toBuffer();

  const logoResizedMetadata = await sharp(resizedLogoBuffer).metadata();
  const actualLogoHeight = logoResizedMetadata.height || Math.round(logoTargetWidth * 0.35);

  // Overlay in the top-right corner
  const topMargin = Math.round(baseHeight * 0.06);
  const rightMargin = Math.round(baseWidth * 0.05);
  const leftPos = baseWidth - logoTargetWidth - rightMargin;

  // Create a clean subtle dark pill backing with soft white border
  const pillPaddingX = 22;
  const pillPaddingY = 12;
  const pillWidth = logoTargetWidth + pillPaddingX * 2;
  const pillHeight = actualLogoHeight + pillPaddingY * 2;

  const svgPill = Buffer.from(`
    <svg width="${pillWidth}" height="${pillHeight}">
      <rect x="0" y="0" width="${pillWidth}" height="${pillHeight}" rx="14" fill="#ffffff" stroke="rgba(255, 255, 255, 0.3)" stroke-width="1.5"/>
    </svg>
  `);

  const compositeBuffer = await sharp(inputBuffer)
    .composite([
      {
        input: svgPill,
        top: Math.max(0, topMargin - pillPaddingY),
        left: Math.max(0, leftPos - pillPaddingX),
      },
      {
        input: resizedLogoBuffer,
        top: topMargin,
        left: leftPos,
      },
    ])
    .jpeg({ quality: 95 })
    .toBuffer();

  fs.writeFileSync(outPath, compositeBuffer);
  console.log(`[LOGO_OVERLAY] Successfully overlaid Demoly logo on ${path.basename(outPath)}`);
  return outPath;
}
