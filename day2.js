const { parse } = require('path');

const lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('input.txt'),
});

let lineNr = 1;
let sum = 0;

lineReader.on('line', function (line) {
  const parts = line.split(':');
  const sets = parts[1].split(';');
  // red green blue
  let possible = true;
  const count = [0, 0, 0];
  sets.forEach((set) => {
    const cubes = set.split(',');
    cubes.forEach((cube) => {
      const color = cube.trim().split(' ')[1];
      const value = parseInt(cube.trim().split(' ')[0]);
      if (color === 'red') {
        count[0] = Math.max(count[0], value);
      } else if (color === 'green') {
        count[1] = Math.max(count[1], value);
      } else if (color === 'blue') {
        count[2] = Math.max(count[2], value);
      }
    });
  });
  const power = count[0] * count[1] * count[2];
  sum += power;
  lineNr++;
});

lineReader.on('close', function () {
  console.log(sum);
});
