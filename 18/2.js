const { parse } = require('path');
const fs = require('node:fs');
const path = require('path');

const instructions = [];
let x = 0;
let y = 0;

const lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('input.txt'),
});

let minX = Infinity;
let minY = Infinity;

lineReader.on('line', function (line) {
  const parts = line.split(' ');

  const code = parts[2].substring(2, parts[2].length - 1);
  const count = parseInt(code.substring(0, code.length - 1), 16);
  const directionCode = code[code.length - 1];
  const map = {
    0: 'R',
    1: 'D',
    2: 'L',
    3: 'U',
  };
  const direction = map[directionCode];
  instructions.push({ direction, count });

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
  minX = Math.min(minX, x);
  minY = Math.min(minY, y);
});

function dig(startingPoint) {
  let x = startingPoint[0];
  let y = startingPoint[1];
  const vertices = [[x, y]];
  let sum = 1;

  instructions.forEach((instruction) => {
    const { direction, count } = instruction;
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
    sum += count;
    vertices.push([x, y]);
  });
  return [vertices, sum];
}

lineReader.on('close', function () {
  const startingPoint = [Math.abs(minX), Math.abs(minY)];
  const [vertices, perimeter] = dig(startingPoint);
  let sum = 0;
  const n = vertices.length;
  for (let i = 0; i < vertices.length; i++) {
    sum =
      sum +
      vertices[i][0] * vertices[(i + 1) % n][1] -
      vertices[i][1] * vertices[(i + 1) % n][0];
  }
  const area = 0.5 * Math.abs(sum);
  // Pick's theorem
  const internalPoints = area + 1 - Math.round(perimeter / 2);
  console.log(internalPoints + perimeter);
});
