const fs = require('fs');
const { createCanvas } = require('canvas');

// Create a 32x32 pixelated QR-style favicon
const size = 32;
const canvas = createCanvas(size, size);
const ctx = canvas.getContext('2d');

// Background
ctx.fillStyle = '#FFFFFF';
ctx.fillRect(0, 0, size, size);

// Define a pixelated QR pattern (8-bit style)
const pattern = [
  [1,1,1,1,1,1,1,0,0,1,0,0,0,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,1,0,1,0,1,0,0,1,0,0,0,0,0,0,1],
  [1,0,1,1,1,0,1,0,0,1,1,1,0,1,0,1,1,1,0,0,1],
  [1,0,1,1,1,0,1,0,1,0,0,0,0,1,0,1,1,1,0,0,1],
  [1,0,1,1,1,0,1,0,0,1,1,0,0,1,0,1,1,1,0,0,1],
  [1,0,0,0,0,0,1,0,1,1,0,1,0,1,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,0,1,0,1,0,0,1,1,1,1,1,1,1,1],
  [0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0],
  [0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,0,1,0,1,0],
  [1,0,0,1,0,0,0,1,0,1,0,0,0,1,1,0,1,0,1,0,1],
  [0,1,0,0,1,1,1,0,1,0,1,1,0,0,0,1,1,1,0,1,0],
  [1,0,1,1,0,0,0,1,0,1,1,0,1,1,1,0,0,0,1,0,1],
  [0,1,0,1,1,1,1,0,1,0,0,1,0,0,0,1,0,1,0,1,0],
  [0,0,0,0,0,0,0,0,1,1,0,1,1,0,1,0,1,0,1,0,1],
  [1,1,1,1,1,1,1,0,0,0,1,0,0,1,0,1,0,1,0,1,0],
  [1,0,0,0,0,0,1,0,1,1,0,1,1,0,1,0,1,0,1,0,1],
  [1,0,1,1,1,0,1,0,0,0,1,0,0,1,0,1,1,1,0,1,0],
  [1,0,1,1,1,0,1,0,1,1,0,1,1,0,1,0,0,0,1,0,1],
  [1,0,1,1,1,0,1,0,0,1,1,0,0,1,0,1,0,1,0,1,0],
  [1,0,0,0,0,0,1,0,1,0,0,1,1,0,1,0,1,0,1,0,1],
  [1,1,1,1,1,1,1,0,0,1,0,0,0,1,0,1,0,1,0,1,0],
];

// Draw pixelated pattern
const pixelSize = Math.floor(size / 21);
ctx.fillStyle = '#1a1a1a'; // Dark color for QR pixels

for (let y = 0; y < pattern.length && y < 21; y++) {
  for (let x = 0; x < pattern[y].length && x < 21; x++) {
    if (pattern[y][x] === 1) {
      ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
    }
  }
}

// Add Happy Operators accent - small red/teal corner markers
ctx.fillStyle = '#FF6B6B'; // Happy Operators red
ctx.fillRect(0, 0, pixelSize * 3, pixelSize);
ctx.fillRect(0, 0, pixelSize, pixelSize * 3);

ctx.fillStyle = '#4ECDC4'; // Happy Operators teal
ctx.fillRect((21 - 3) * pixelSize, 0, pixelSize * 3, pixelSize);
ctx.fillRect((21 - 1) * pixelSize, 0, pixelSize, pixelSize * 3);

// Save as ICO format (we'll convert to proper ICO later)
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('public/favicon-temp.png', buffer);

console.log('✓ Favicon PNG generated');
