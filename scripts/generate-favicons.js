const fs = require("fs");
const path = require("path");

/**
 * Builds favicon PNGs and a multi-size ICO from src/app/icon.svg.
 *
 * Browsers ask for /favicon.ico even when <link rel="icon"> is present, so the
 * ICO is generated here instead of relying on the PNG links alone.
 */
function buildIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);

  let offset = 6 + images.length * 16;
  const entries = images.map(({ size, buffer }) => {
    const entry = Buffer.alloc(16);
    const dimension = size >= 256 ? 0 : size;
    entry.writeUInt8(dimension, 0);
    entry.writeUInt8(dimension, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(buffer.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += buffer.length;
    return entry;
  });

  return Buffer.concat([header, ...entries, ...images.map(({ buffer }) => buffer)]);
}

async function generateFavicons() {
  const sharp = require("sharp");
  const root = path.join(__dirname, "..");
  const svgPath = path.join(root, "src", "app", "icon.svg");
  const iconDir = path.join(root, "public", "icons");
  const imagesDir = path.join(root, "public", "images");

  const svg = fs.readFileSync(svgPath);
  // Apple icons and installable app icons are masked by the OS, so their
  // artwork must run to the edges instead of carrying our own rounded corners.
  const fullBleedSvg = Buffer.from(
    svg.toString().replace('rx="112"', 'rx="0"')
  );

  fs.mkdirSync(iconDir, { recursive: true });

  const render = (source, size) =>
    sharp(source).resize(size, size).png().toBuffer();

  const sizes = [
    { name: "favicon-16x16.png", size: 16 },
    { name: "favicon-32x32.png", size: 32 },
    { name: "apple-touch-icon.png", size: 180 },
    { name: "icon-192.png", size: 192 },
    { name: "icon-512.png", size: 512 },
  ];

  for (const { name, size } of sizes) {
    const source = name === "apple-touch-icon.png" ? fullBleedSvg : svg;
    const buffer = await render(source, size);
    fs.writeFileSync(path.join(iconDir, name), buffer);
    console.log("Generated:", path.join("public", "icons", name));
  }

  await sharp(svg).resize(512, 512).png().toFile(
    path.join(imagesDir, "app_logo.png")
  );
  console.log("Generated:", path.join("public", "images", "app_logo.png"));

  const icoImages = await Promise.all(
    [16, 32, 48].map(async (size) => ({
      size,
      buffer: await render(svg, size),
    }))
  );
  fs.writeFileSync(
    path.join(root, "src", "app", "favicon.ico"),
    buildIco(icoImages)
  );
  console.log("Generated:", path.join("src", "app", "favicon.ico"));

  await sharp(fullBleedSvg)
    .resize(180, 180)
    .png()
    .toFile(path.join(root, "src", "app", "apple-icon.png"));
  console.log("Generated:", path.join("src", "app", "apple-icon.png"));
}

generateFavicons().catch((err) => {
  console.error(err);
  process.exit(1);
});
