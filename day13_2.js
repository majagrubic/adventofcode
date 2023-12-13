const { parse } = require('path');

const lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('input.txt'),
});

let pattern = [];
const patterns = [];

lineReader.on('line', function (line) {
  if (line.length === 0) {
    patterns.push(pattern);
    pattern = [];
    return;
  }
  const lineArr = line.split('');
  pattern.push(lineArr);
});

function findReflectionLines(p) {
  const rows = [];
  for (let row = 1; row < p.length; row++) {
    let reflection = true;
    let offset = 1;
    while (row - offset >= 0 && row + offset - 1 < p.length) {
      for (let col = 0; col < p[0].length; col++) {
        // console.log('row ' + row);
        // console.log(fileData[row][col - offset] + '  ' + fileData[row][col + offset]);
        if (p[row - offset][col] !== p[row + offset - 1][col]) {
          reflection = false;
          break;
        }
      }
      if (!reflection) {
        break;
      }
      offset++;
    }
    if (reflection) {
      rows.push(row);
    }
  }
  return rows;
}

lineReader.on('close', function () {
  patterns.push(pattern);
  const rows = [];
  const columns = [];
  patterns.forEach((p) => {
    const set = new Set();
    for (let col = 1; col < p[0].length; col++) {
      //  console.log('col ' + col);
      let mismatchCount = 0;
      let offset = 1;
      while (col - offset >= 0 && col + offset - 1 < p[0].length) {
        for (let row = 0; row < p.length; row++) {
          // console.log('row ' + row);
          // console.log(fileData[row][col - offset] + '  ' + fileData[row][col + offset]);
          if (p[row][col - offset] !== p[row][col + offset - 1]) {
            mismatchCount++;
          }
        }
        offset++;
      }
      if (mismatchCount === 1) {
        columns.push(col);
      }
    }

    for (let row = 1; row < p.length; row++) {
      let offset = 1;
      let mismatchCount = 0;
      while (row - offset >= 0 && row + offset <= p.length) {
        for (let col = 0; col < p[0].length; col++) {
          // console.log('row ' + row);
          // console.log(fileData[row][col - offset] + '  ' + fileData[row][col + offset]);
          if (p[row - offset][col] !== p[row + offset - 1][col]) {
            mismatchCount++;
          }
        }
        offset++;
      }
      if (mismatchCount === 1) {
        rows.push(row);
      }
    }
    console.log(rows);
  });
  let sum = columns.reduce((prev, col) => col + prev, 0);
  sum += rows.reduce((prev, row) => row * 100 + prev, 0);
  console.log(sum);
});
