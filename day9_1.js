const { parse } = require('path');

const lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('input.txt'),
});
let sum = 0;

function findHistory(arr) {
  const history = [];
  history.push(arr);
  let current = arr;
  while (!current.every((value) => value === 0)) {
    const next = [];
    for (let i = 1; i < current.length; i++) {
      next.push(current[i] - current[i - 1]);
    }
    history.push(next);
    current = next;
  }
  return history;
}

function findNextInSequence(history) {
  let prev = 0;
  for (let i = history.length - 2; i >= 0; i--) {
    prev = prev + history[i].slice(-1)[0];
  }
  return prev;
}

lineReader.on('line', function (line) {
  const numbers = line.split(' ').map((value) => parseInt(value));
  const history = findHistory(numbers);
  const next = findNextInSequence(history);
  sum += next;
});

lineReader.on('close', function () {
  console.log(sum);
});
