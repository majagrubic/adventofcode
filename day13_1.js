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

lineReader.on('close', function () {
  patterns.push(pattern);
  const columns = [];
  const rows = [];

  patterns.forEach((p) => {
    for (let col = 1; col < p[0].length; col++) {
      let reflection = true;
      let offset = 1;
      while (col - offset >= 0 && col + offset - 1 < p[0].length) {
        for (let row = 0; row < p.length; row++) {
          if (p[row][col - offset] !== p[row][col + offset - 1]) {
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
        columns.push(col);
      }
    }

    for (let row = 1; row < p.length; row++) {
      let reflection = true;
      let offset = 1;
      while (row - offset >= 0 && row + offset - 1 < p.length) {
        for (let col = 0; col < p[0].length; col++) {
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
  });
  let sum = columns.reduce((prev, col) => col + prev, 0);
  sum = rows.reduce((prev, row) => prev + 100 * row, sum);
  console.log(sum);
});
