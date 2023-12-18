const { parse } = require('path');
const fs = require('node:fs');
const path = require('path');

const instructions = [];
let matrix = [];
let x = 0;
let y = 0;

const lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('input.txt'),
});

let maxX = -Infinity;
let minX = Infinity;
let minY = Infinity;
let maxY = -Infinity;

lineReader.on('line', function (line) {
  const parts = line.split(' ');
  const direction = parts[0];
  const count = parseInt(parts[1]);
  instructions.push({ direction, count, color: parts[2] });

  switch (direction) {
    case 'R':
      y = y + count;
      break;
    case 'L':
      y = y - count;
      break;
    case 'D':
      x = x + count;
      break;
    case 'U':
      x = x - count;
      break;
  }
  maxX = Math.max(maxX, x);
  maxY = Math.max(maxY, y);
  minX = Math.min(minX, x);
  minY = Math.min(minY, y);
});

function printData(data) {
  let buff = '';
  for (let row = 0; row < data.length; row++) {
    console.log(data[row].join(''));
    buff = buff + data[row].join('');
  }
  console.log('');
  buff = buff + '';
  return buff;
}

function dig(matrix, startingPoint) {
  let x = startingPoint[0];
  let y = startingPoint[1];

  instructions.forEach((instruction) => {
    const { direction, count } = instruction;
    switch (direction) {
      case 'R':
        for (let c = y; c <= y + count; c++) {
          matrix[x][c] = '#';
        }
        y = y + count;
        break;
      case 'L':
        for (let c = y; c >= y - count; c--) {
          matrix[x][c] = '#';
        }
        y = y - count;
        break;
      case 'D':
        for (let r = x; r <= x + count; r++) {
          matrix[r][y] = '#';
        }
        x = x + count;
        break;
      case 'U':
        for (let r = x; r >= x - count; r--) {
          matrix[r][y] = '#';
        }
        x = x - count;
        break;
    }
  });
}

function floodFill(startRow, startCol, rows, cols) {
  const queue = [];
  const visited = new Set();
  queue.push([startRow, startCol]);
  while (queue.length > 0) {
    const node = queue.shift();
    const row = node[0];
    const col = node[1];
    if (row >= rows || row < 0 || col >= cols || col < 0) {
      continue;
    }
    const hash = row + ',' + col;
    // console.log(hash);
    if (visited.has(hash)) {
      continue;
    }
    visited.add(hash);
    if (matrix[row][col] === '#') {
      continue;
    }
    matrix[row][col] = '#';
    queue.push([row, col + 1]);
    queue.push([row, col - 1]);
    queue.push([row - 1, col]);
    queue.push([row + 1, col]);
  }
}

lineReader.on('close', function () {
  const rows = maxX - minX + 1;
  const cols = maxY - minY + 1;
  matrix = new Array(rows).fill('.').map((el) => new Array(cols).fill('.'));
  const startingPoint = [Math.abs(minX), Math.abs(minY)];
  dig(matrix, startingPoint);
  floodFill(1, 66, rows, cols);
  printData(matrix);
  let sum = 0;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (matrix[i][j] === '#') {
        sum++;
      }
    }
  }
  console.log(sum);
});
