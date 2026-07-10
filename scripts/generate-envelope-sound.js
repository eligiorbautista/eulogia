const fs = require("fs");
const path = require("path");

const SAMPLE_RATE = 44100;
const BITS_PER_SAMPLE = 16;
const BYTES_PER_SAMPLE = BITS_PER_SAMPLE / 8;
const CHANNELS = 1;

function writeWav(filename, samples) {
  const byteLength = samples.length * BYTES_PER_SAMPLE;
  const buffer = Buffer.alloc(44 + byteLength);

  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + byteLength, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(CHANNELS, 22);
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(SAMPLE_RATE * CHANNELS * BYTES_PER_SAMPLE, 28);
  buffer.writeUInt16LE(CHANNELS * BYTES_PER_SAMPLE, 32);
  buffer.writeUInt16LE(BITS_PER_SAMPLE, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(byteLength, 40);

  for (let i = 0; i < samples.length; i++) {
    const clamped = Math.max(-1, Math.min(1, samples[i]));
    buffer.writeInt16LE(Math.round(clamped * 32767), 44 + i * BYTES_PER_SAMPLE);
  }

  fs.writeFileSync(filename, buffer);
}

function generateEnvelopeSound() {
  const totalDuration = 1.0;
  const totalSamples = Math.floor(SAMPLE_RATE * totalDuration);
  const samples = new Float32Array(totalSamples).fill(0);

  // Paper page-turn rustle: white noise shaped by a quick burst envelope
  // and amplitude-modulated with slower noise for a crinkly texture.
  const rustleDuration = 0.7;
  const rustleSamples = Math.floor(SAMPLE_RATE * rustleDuration);

  for (let i = 0; i < rustleSamples; i++) {
    const t = i / SAMPLE_RATE;
    // Main burst envelope: fast attack, slower decay
    const envelope = Math.min(1, t / 0.04) * Math.min(1, (rustleDuration - t) / 0.25);

    // White noise base
    const noise = Math.random() * 2 - 1;

    // Crinkle texture: slower random modulation
    const crinkle = 0.5 + 0.5 * Math.sin(i * 0.03) * Math.random();

    // High-frequency emphasis for paper character
    const emphasized = noise * (0.6 + 0.4 * Math.sin(i * 0.15));

    samples[i] += emphasized * crinkle * envelope * 0.55;
  }

  return samples;
}

const outputPath = path.join(__dirname, "..", "public", "sounds", "envelope-open.wav");
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
writeWav(outputPath, generateEnvelopeSound());
console.log("Generated:", outputPath);
