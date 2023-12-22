const { parse } = require('path');
const fs = require('node:fs');
const path = require('path');

const matrix = [];
let x = 0;
let y = 0;
let lineNr = 0;

const lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('input.txt'),
});

lineReader.on('line', function (line) {
  const lineArr = line.split('');
  matrix.push(lineArr);
  const indexOfS = line.indexOf('S');
  if (indexOfS !== -1) {
    x = lineNr;
    y = indexOfS;
  }
  lineNr++;
});

function printData(data) {
  for (let row = 0; row < data.length; row++) {
    console.log(data[row].join(''));
  }
  console.log('');
}

function bfs(rows, cols, maxSteps) {
  const visited = new Set();
  const queue = [];
  queue.push({ row: x, col: y, steps: maxSteps });
  visited.add(x + ',' + y);
  while (queue.length > 0) {
    const node = queue.shift();
    const { row, col, steps } = node;
    if (steps % 2 === 0) {
      matrix[row][col] = 'O';
    }
    if (steps === 0) {
      continue;
    }

    [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ].forEach(([r, c]) => {
      const nextRow = row + r;
      const nextCol = col + c;
      if (nextRow >= rows || nextRow < 0 || nextCol >= cols || nextCol < 0) {
        return;
      }
      const hash = nextRow + ',' + nextCol;
      if (visited.has(hash) || matrix[nextRow][nextCol] === '#') {
        return;
      }
      visited.add(hash);
      queue.push({ row: nextRow, col: nextCol, steps: steps - 1 });
    });
  }
}

lineReader.on('close', function () {
  const rows = matrix.length;
  const cols = matrix[0].length;

  bfs(rows, cols, 64);
  printData(matrix);
  let sum = 0;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (matrix[i][j] === 'O') {
        sum++;
      }
    }
  }
  console.log(sum);
});
