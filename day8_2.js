const { parse } = require('path');

const lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('input.txt'),
});

let instructions = '';
let lineNr = 0;
let map = new Map();
const startingPoints = [];

function findLCD(numbers) {
  let result = numbers[0];
  for (let i = 1; i < numbers.length; i++) {
    result = findLCM(result, numbers[i]);
  }
  return result;
}

function findLCM(a, b) {
  const max = Math.max(a, b);
  const min = Math.min(a, b);

  // Calculate LCM using the formula: LCM(a, b) = (|a * b|) / GCD(a, b)
  return (max / findGCD(max, min)) * min;
}

function findGCD(a, b) {
  // Use Euclidean algorithm to find GCD
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

lineReader.on('line', function (line) {
  if (lineNr === 0) {
    instructions = line;
  } else if (lineNr > 1) {
    const parts = line.split(' = ');
    const point = parts[0];
    const left = parts[1].split(', ')[0].substring(1);
    const right = parts[1].split(', ')[1].slice(0, -1);
    map.set(point, { left, right });
    if (point.endsWith('A')) {
      startingPoints.push(point);
    }
  }
  lineNr++;
});

lineReader.on('close', function () {
  const n = instructions.length;
  let currentPoints = startingPoints;
  const counts = new Map();

  for (let j = 0; j < currentPoints.length; j++) {
    let point = currentPoints[j];
    let i = 0;
    while (!point.endsWith('Z')) {
      const direction = instructions[i % n];
      if (direction === 'L') {
        point = map.get(point).left;
      } else {
        point = map.get(point).right;
      }
      i++;
    }
    counts.set(j, i);
  }
  const values = Array.from(counts.values());
  console.log(findLCD(values));
});
