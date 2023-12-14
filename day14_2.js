const { parse } = require('path');

const lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('input.txt'),
});

let data = [];

function tiltNorth() {
  for (let row = 1; row < data.length; row++) {
    for (let i = row; i > 0; i--) {
      for (let j = 0; j < data[0].length; j++) {
        if (data[i][j] === 'O' && data[i - 1][j] === '.') {
          data[i - 1][j] = 'O';
          data[i][j] = '.';
        }
      }
    }
  }
}

function tiltSouth() {
  for (let row = data.length - 2; row >= 0; row--) {
    for (let i = row; i < data.length - 1; i++) {
      for (let j = 0; j < data[0].length; j++) {
        if (data[i][j] === 'O' && data[i + 1][j] === '.') {
          data[i + 1][j] = 'O';
          data[i][j] = '.';
        }
      }
    }
  }
}

function tiltEast() {
  for (let col = data[0].length - 2; col >= 0; col--) {
    for (let j = col; j < data[0].length; j++) {
      for (let i = 0; i < data.length; i++) {
        if (data[i][j] === 'O' && data[i][j + 1] === '.') {
          data[i][j + 1] = 'O';
          data[i][j] = '.';
        }
      }
    }
  }
}

function tiltWest() {
  for (let col = 0; col < data[0].length; col++) {
    for (let j = col; j > 0; j--) {
      for (let i = 0; i < data.length; i++) {
        if (data[i][j] === 'O' && data[i][j - 1] === '.') {
          data[i][j - 1] = 'O';
          data[i][j] = '.';
        }
      }
    }
  }
}

lineReader.on('line', function (line) {
  const lineArr = line.split('');
  data.push(lineArr);
});

function printData(data) {
  for (let row = 0; row < data.length; row++) {
    console.log(data[row].join(''));
  }
  console.log('');
}

function compareData(x, y) {
  return JSON.stringify(x) === y;
}

lineReader.on('close', function () {
  const cycles = 1000;
  const set = new Set();

  for (let i = 0; i < cycles; i++) {
    tiltNorth();
    tiltWest();
    tiltSouth();
    tiltEast();

    let count = 0;
    let offset = data.length;
    for (let row = 0; row < data.length; row++) {
      for (let col = 0; col < data[0].length; col++) {
        if (data[row][col] === 'O') {
          count += offset;
        }
      }
      offset--;
    }
    if (set.has(count)) {
      console.log('Repeating ' + i + ' ' + count);
    }
    set.add(count);
  }
  // 5 -> 6 -> 6 -> 6
  console.log(set);
  //printData(data);
});
