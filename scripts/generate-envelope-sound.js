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
  const totalDuration = 1.5;
  const totalSamples = Math.floor(SAMPLE_RATE * totalDuration);
  const samples = new Float32Array(totalSamples).fill(0);

  // Rustling noise (0 - 0.6s)
  const rustleDuration = 0.6;
  const rustleSamples = Math.floor(SAMPLE_RATE * rustleDuration);
  for (let i = 0; i < rustleSamples; i++) {
    const t = i / SAMPLE_RATE;
    const envelope = Math.min(1, t / 0.1) * Math.min(1, (rustleDuration - t) / 0.15);
    samples[i] += (Math.random() * 2 - 1) * envelope * 0.4;
  }

  // Magical chime (0.3s - 1.2s, 880Hz A5 with decay)
  const chimeStart = 0.3;
  const chimeDuration = 0.9;
  const chimeSamples = Math.floor(SAMPLE_RATE * chimeDuration);
  const frequency = 880;
  for (let i = 0; i < chimeSamples; i++) {
    const t = i / SAMPLE_RATE;
    const sampleIndex = Math.floor((chimeStart + t) * SAMPLE_RATE);
    if (sampleIndex >= totalSamples) break;
    const decay = Math.exp(-t * 4);
    samples[sampleIndex] += Math.sin(2 * Math.PI * frequency * t) * decay * 0.5;
  }

  return samples;
}

const outputPath = path.join(__dirname, "..", "public", "sounds", "envelope-open.wav");
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
writeWav(outputPath, generateEnvelopeSound());
console.log("Generated:", outputPath);
