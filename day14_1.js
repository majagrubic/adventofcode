const { parse } = require('path');

const lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('input.txt'),
});

let data = [];

function tiltNorth(startingRow) {
  for (let i = startingRow; i > 0; i--) {
    for (let j = 0; j < data[0].length; j++) {
      if (data[i][j] === 'O' && data[i - 1][j] === '.') {
        data[i - 1][j] = 'O';
        data[i][j] = '.';
      }
    }
  }
}

lineReader.on('line', function (line) {
  const lineArr = line.split('');
  data.push(lineArr);
});

lineReader.on('close', function () {
  for (let row = 1; row < data.length; row++) {
    tiltNorth(row);
  }
  let count = 0;
  let offset = data.length;
  for (let row = 0; row < data.length; row++) {
    for (let col = 0; col < data[0].length; col++) {
      if (data[row][col] === 'Oå') {
        count += offset;
      }
    }
    offset--;
  }
  console.log(count);
});
