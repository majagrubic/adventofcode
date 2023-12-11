const { parse } = require('path');
const path = require('path');
const fs = require('fs');

const lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('input.txt'),
});

const data = [];
let row = 0;
const galaxies = [];
const colsWithGalaxies = new Set();
const rowsWithGalaxies = new Set();

const OFFSET = 999999;

lineReader.on('line', function (line) {
  data.push(line);
  for (let i = 0; i < line.length; i++) {
    if (line[i] === '#') {
      rowsWithGalaxies.add(row);
      colsWithGalaxies.add(i);
    }
  }
  row++;
});

lineReader.on('close', function () {
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[0].length; j++) {
      if (data[i][j] === '#') {
        galaxies.push([i, j]);
      }
    }
  }
  let j = 0;
  for (let i = data.length - 1; i >= 0; i--) {
    if (!rowsWithGalaxies.has(i)) {
      galaxies.forEach((galaxy) => {
        if (galaxy[0] > i) {
          galaxy[0] += OFFSET;
        }
      });
    }
  }
  for (let j = data[0].length - 1; j >= 0; j--) {
    if (!colsWithGalaxies.has(j)) {
      galaxies.forEach((galaxy) => {
        if (galaxy[1] > j) {
          galaxy[1] += OFFSET;
        }
      });
    }
  }
  let sum = 0;
  for (let i = 0; i < galaxies.length; i++) {
    for (let j = i; j < galaxies.length; j++) {
      const a = galaxies[i];
      const b = galaxies[j];
      const distance = Math.abs(b[0] - a[0]) + Math.abs(b[1] - a[1]);
      sum += distance;
    }
  }
  console.log(sum);
});
