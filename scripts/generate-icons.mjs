// Generates the PWA icons from the brand mark: a white V on the brand blue.
// Pure Node, no image libraries: raw RGBA -> zlib -> PNG chunks.
import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, '..', 'public', 'icons');

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([length, body, crc]);
}

function encodePng(width, height, pixels) {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y += 1) {
    raw[y * (width * 4 + 1)] = 0;
    pixels.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }
  return Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

function distanceToSegment(px, py, ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;
  const lengthSq = dx * dx + dy * dy;
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lengthSq));
  const cx = ax + t * dx;
  const cy = ay + t * dy;
  return Math.hypot(px - cx, py - cy);
}

function drawIcon(size, inset) {
  const pixels = Buffer.alloc(size * size * 4);
  const scale = inset;
  const point = (x, y) => [0.5 + (x - 0.5) * scale, 0.5 + (y - 0.5) * scale];
  const [ax, ay] = point(0.32, 0.3);
  const [bx, by] = point(0.5, 0.72);
  const [cx, cy] = point(0.68, 0.3);
  const stroke = 0.055 * scale;

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const nx = (x + 0.5) / size;
      const ny = (y + 0.5) / size;
      const distance = Math.min(
        distanceToSegment(nx, ny, ax, ay, bx, by),
        distanceToSegment(nx, ny, cx, cy, bx, by)
      );
      const edge = Math.max(0, Math.min(1, (stroke + 0.008 - distance) / 0.016));
      const offset = (y * size + x) * 4;
      pixels[offset] = Math.round(44 + (255 - 44) * edge);
      pixels[offset + 1] = Math.round(123 + (255 - 123) * edge);
      pixels[offset + 2] = Math.round(168 + (255 - 168) * edge);
      pixels[offset + 3] = 255;
    }
  }
  return encodePng(size, size, pixels);
}

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'icon-192.png'), drawIcon(192, 1));
writeFileSync(join(outDir, 'icon-512.png'), drawIcon(512, 1));
writeFileSync(join(outDir, 'icon-maskable-512.png'), drawIcon(512, 0.72));
console.log('Wrote icon-192.png, icon-512.png and icon-maskable-512.png');
