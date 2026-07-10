const fs = require("fs");
const path = require("path");

async function generateFavicons() {
  const sharp = require("sharp");
  const inputPath = path.join(__dirname, "..", "public", "app_logo.png");
  const outputDir = path.join(__dirname, "..", "public");

  const sizes = [
    { name: "favicon-16x16.png", width: 16, height: 16 },
    { name: "favicon-32x32.png", width: 32, height: 32 },
    { name: "apple-touch-icon.png", width: 180, height: 180 },
  ];

  for (const { name, width, height } of sizes) {
    await sharp(inputPath)
      .resize(width, height, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(outputDir, name));
    console.log("Generated:", name);
  }
}

generateFavicons().catch((err) => {
  console.error(err);
  process.exit(1);
});
