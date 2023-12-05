const { parse } = require('path');

const lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('input.txt'),
});

//for the first part
let sum = 0;
const map = new Map();
let lineNr = 1;

lineReader.on('line', function (line) {
  const parts = line.split(' | ');
  const cardNumbers = parts[0]
    .split(': ')[1]
    .split(' ')
    .filter((entry) => entry !== '');
  const winningNumbers = parts[1].split(' ').filter((entry) => entry !== '');
  let cardPoints = 0;
  if (!map.has(lineNr)) {
    map.set(lineNr, 1);
  } else {
    map.set(lineNr, map.get(lineNr) + 1);
  }
  cardNumbers.forEach((cardNumber) => {
    if (winningNumbers.includes(cardNumber)) {
      cardPoints++;
    }
  });
  const copies = map.get(lineNr);
  for (let i = 1; i <= cardPoints; i++) {
    const cardNumber = lineNr + i;
    if (!map.has(cardNumber)) {
      map.set(cardNumber, copies);
    } else {
      map.set(cardNumber, map.get(cardNumber) + copies);
    }
  }
  lineNr++;
});

lineReader.on('close', function () {
  let cardSum = 0;
  for ([key, value] of map) {
    cardSum += value;
  }
  console.log(cardSum);
});
