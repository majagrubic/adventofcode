const { parse } = require('path');

const lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('input.txt'),
});

function countWays(input, block, pos, blocksPos, count) {
  if (pos > input.length) {
    return 0;
  }
  if (pos === input.length) {
    if (blocksPos === block.length && count === 0) {
      return 1;
    } else if (blocksPos === block.length - 1 && block[blocksPos] === count) {
      return 1;
    }
    return 0;
  }
  let result = 0;
  ['.', '#'].forEach((c) => {
    if (input[pos] === c || input[pos] === '?') {
      if (c === '.' && count === 0) {
        result += countWays(input, block, pos + 1, blocksPos, 0);
      } else if (
        c === '.' &&
        count > 0 &&
        blocksPos < block.length &&
        block[blocksPos] === count
      ) {
        result += countWays(input, block, pos + 1, blocksPos + 1, 0);
      } else if (c === '#') {
        result += countWays(input, block, pos + 1, blocksPos, count + 1);
      }
    }
  });
  return result;
}

const inputs = [];
const blocks = [];

lineReader.on('line', function (line) {
  const parts = line.split(' ');
  const block = parts[1].split(',').map((bP) => parseInt(bP));
  inputs.push(parts[0].trim());
  blocks.push(block);
});

lineReader.on('close', function (line) {
  let sum = 0;
  for (let i = 0; i < inputs.length; i++) {
    sum += countWays(inputs[i], blocks[i], 0, 0, 0);
  }
  console.log(sum);
});
