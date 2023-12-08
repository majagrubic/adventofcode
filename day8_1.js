const { parse } = require('path');

const lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('input.txt'),
});

let instructions = '';
let lineNr = 0;
let map = new Map();

lineReader.on('line', function (line) {
  if (lineNr === 0) {
    instructions = line;
  } else if (lineNr > 1) {
    const parts = line.split(' = ');
    const point = parts[0];
    const left = parts[1].split(', ')[0].substring(1);
    const right = parts[1].split(', ')[1].slice(0, -1);
    map.set(point, { left, right });
  }
  lineNr++;
});

lineReader.on('close', function () {
  let i = 0;
  const n = instructions.length;
  let point = 'AAA';
  while (point !== 'ZZZ') {
    const directions = map.get(point);
    const direction = instructions[i % n];
    if (direction === 'L') {
      point = directions.left;
    } else {
      point = directions.right;
    }
    i++;
  }
  console.log(i);
});
