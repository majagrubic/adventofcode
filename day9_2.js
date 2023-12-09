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

function findFirstInSequence(history) {
  let prev = 0;
  for (let i = history.length - 2; i >= 0; i--) {
    prev = history[i][0] - prev;
  }
  return prev;
}

lineReader.on('line', function (line) {
  const numbers = line
    .split(' ')
    .map((value) => parseInt(value))
    .filter((value) => !isNaN(value));
  const history = findHistory(numbers);
  const first = findFirstInSequence(history);
  sum += first;
});

lineReader.on('close', function () {
  console.log(sum);
});
