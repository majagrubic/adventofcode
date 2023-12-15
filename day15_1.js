const { parse } = require('path');

const lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('input.txt'),
});

let parts = [];

function hash(input) {
  let sum = 0;
  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    const ascii = c.charCodeAt(0);
    sum += ascii;
    sum = sum * 17;
    sum = sum % 256;
  }
  return sum;
}

lineReader.on('line', function (line) {
  parts = line.split(',');
});

lineReader.on('close', function () {
  let sum = 0;
  parts.forEach((part) => {
    sum += hash(part);
  });
  console.log(sum);
});
