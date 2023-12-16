const { parse } = require('path');

const lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('input.txt'),
});

let parts = [];
const slots = new Map();

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
  parts.forEach((part) => {
    const label = part.includes('=') ? part.split('=')[0] : part.split('-')[0];
    const slotNr = hash(label);
    console.log(slotNr);
    if (!slots.has(slotNr)) {
      slots.set(slotNr, []);
    }
    const lenses = slots.get(slotNr);
    const indexOfLens = lenses.map((lens) => lens.label).indexOf(label);
    if (part.includes('=')) {
      const value = parseInt(part.split('=')[1]);
      if (indexOfLens === -1) {
        lenses.push({
          label,
          value,
        });
      } else {
        lenses[indexOfLens].value = value;
      }
    } else if (indexOfLens !== -1) {
      lenses.splice(indexOfLens, 1);
    }
  });

  let sum = 0;

  for (let [key, value] of slots) {
    value.forEach((lens, index) => {
      let currValue = key + 1;
      currValue = currValue * (index + 1);
      currValue = currValue * lens.value;
      sum += currValue;
    });
  }

  console.log(sum);
});
