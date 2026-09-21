const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

/**
 * Generates brand assets for Censurado Linktree:
 * - /public/images/avatar.webp
 * - /public/images/nueva-cordoba.webp
 * - /public/images/og-cover.jpg
 * - /public/favicon.svg
 * - /public/favicon.ico
 */
async function generateAssets() {
  const imagesDir = path.resolve(__dirname, '../public/images');
  const publicDir = path.resolve(__dirname, '../public');
  const sourceFondo = path.resolve(__dirname, '../imagenes/Fondo Censurado.png');
  const sourceLogo = path.resolve(__dirname, '../imagenes/LOGO CENSURADO.png');

  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  // Censurado yellow smiley SVG face overlay
  const smileySvg = `
  <svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- Outer circle with rough hand-drawn look -->
    <circle cx="200" cy="200" r="140" stroke="#E5AD00" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>
    
    <!-- Left X eye -->
    <path d="M142 162L172 192M172 162L142 192" stroke="#E5AD00" stroke-width="11" stroke-linecap="round"/>
    
    <!-- Right X eye -->
    <path d="M228 162L258 192M258 162L228 192" stroke="#E5AD00" stroke-width="11" stroke-linecap="round"/>
    
    <!-- Smile mouth -->
    <path d="M140 220C155 264 245 264 260 220" stroke="#E5AD00" stroke-width="11" stroke-linecap="round"/>
    
    <!-- Sticking out tongue -->
    <path d="M222 248C222 268 238 274 244 264C250 254 246 238 236 236" stroke="#E5AD00" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
  `;

  // 1. Generate Favicon SVG
  const faviconSvgContent = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
    <rect width="400" height="400" rx="80" fill="#222222"/>
    <circle cx="200" cy="200" r="135" stroke="#E5AD00" stroke-width="14" fill="none" stroke-linecap="round"/>
    <path d="M142 162L172 192M172 162L142 192" stroke="#E5AD00" stroke-width="14" stroke-linecap="round"/>
    <path d="M228 162L258 192M258 162L228 192" stroke="#E5AD00" stroke-width="14" stroke-linecap="round"/>
    <path d="M140 220C155 266 245 266 260 220" stroke="#E5AD00" stroke-width="14" stroke-linecap="round"/>
    <path d="M222 248C222 270 238 276 244 264C250 252 246 236 236 234" stroke="#E5AD00" stroke-width="10" stroke-linecap="round"/>
  </svg>
  `.trim();
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), faviconSvgContent, 'utf-8');
  console.log('Generated favicon.svg');

  // 2. Generate avatar.webp (400x400)
  const fondoBuffer = await sharp(sourceFondo)
    .resize(400, 400, { fit: 'cover', position: 'center' })
    .toBuffer();

  await sharp(fondoBuffer)
    .composite([
      {
        input: Buffer.from(smileySvg),
        top: 0,
        left: 0,
      },
    ])
    .webp({ quality: 90 })
    .toFile(path.join(imagesDir, 'avatar.webp'));
  console.log('Generated avatar.webp');

  // 3. Generate nueva-cordoba.webp (160x160)
  const ncBuffer = await sharp(sourceFondo)
    .resize(160, 160, { fit: 'cover', position: 'center' })
    .toBuffer();

  const ncSmileySvg = `
  <svg width="160" height="160" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="200" cy="200" r="140" stroke="#E5AD00" stroke-width="13" stroke-linecap="round"/>
    <path d="M142 162L172 192M172 162L142 192" stroke="#E5AD00" stroke-width="13" stroke-linecap="round"/>
    <path d="M228 162L258 192M258 162L228 192" stroke="#E5AD00" stroke-width="13" stroke-linecap="round"/>
    <path d="M140 220C155 264 245 264 260 220" stroke="#E5AD00" stroke-width="13" stroke-linecap="round"/>
    <path d="M222 248C222 268 238 274 244 264C250 254 246 238 236 236" stroke="#E5AD00" stroke-width="10" stroke-linecap="round"/>
  </svg>
  `;

  await sharp(ncBuffer)
    .composite([
      {
        input: Buffer.from(ncSmileySvg),
        top: 0,
        left: 0,
      },
    ])
    .webp({ quality: 90 })
    .toFile(path.join(imagesDir, 'nueva-cordoba.webp'));
  console.log('Generated nueva-cordoba.webp');

  // 4. Generate og-cover.jpg (1200x630)
  const ogBackground = await sharp(sourceFondo)
    .resize(1200, 630, { fit: 'cover', position: 'center' })
    .modulate({ brightness: 0.85 })
    .toBuffer();

  // Resize logo for OG
  const logoResized = await sharp(sourceLogo)
    .trim()
    .resize(680, null, { fit: 'inside' })
    .toBuffer();

  // Overlay logo onto OG background
  await sharp(ogBackground)
    .composite([
      {
        input: logoResized,
        gravity: 'center',
      },
    ])
    .jpeg({ quality: 90 })
    .toFile(path.join(imagesDir, 'og-cover.jpg'));
  console.log('Generated og-cover.jpg');

  // 5. Generate favicon.ico (32x32 PNG inside ico or direct 32x32 PNG)
  await sharp(path.join(publicDir, 'favicon.svg'))
    .resize(32, 32)
    .toFormat('png')
    .toFile(path.join(publicDir, 'favicon.png'));
  console.log('Generated favicon.png');
}

generateAssets().catch((err) => {
  console.error('Error generating assets:', err);
  process.exit(1);
});
