const { parse } = require('path');

const lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('input.txt'),
});

const cards = [];
const bids = new Map();

lineReader.on('line', function (line) {
  const parts = line.split(' ');
  cards.push(parts[0]);
  bids.set(parts[0], parseInt(parts[1]));
});

lineReader.on('close', function () {
  const strength = new Map();
  const values = new Map();
  'A,K,Q,J,T,9,8,7,6,5,4,3,2'
    .split(',')
    .reverse()
    .forEach((value, index) => {
      values.set(value, index);
    });
  cards.forEach((card) => {
    const countMap = new Map();
    for (let i = 0; i < 5; i++) {
      if (!countMap.has(card[i])) {
        countMap.set(card[i], 0);
      }
      countMap.set(card[i], countMap.get(card[i]) + 1);
    }
    //console.log(countMap);
    const mapValues = Array.from(countMap.values());
    switch (countMap.size) {
      case 1:
        strength.set(card, { card, rank: 7 });
        break;
      case 2:
        if (mapValues.includes(1)) {
          strength.set(card, { card, rank: 6 });
        } else {
          strength.set(card, { card, rank: 5 });
        }
        break;
      case 3:
        if (mapValues.includes(3)) {
          strength.set(card, { card, rank: 4 });
        } else {
          strength.set(card, { card, rank: 3 });
        }
        break;
      case 4:
        strength.set(card, { card, rank: 2 });
        break;
      case 5:
        strength.set(card, { card, rank: 1 });
        break;
    }
  });
  // console.log(strength);
  const cardRanks = Array.from(strength.values());
  cardRanks.sort((a, b) => {
    if (a.card === b.card) {
      return 0;
    }
    if (a.rank > b.rank) {
      return 1;
    }
    if (a.rank < b.rank) {
      return -1;
    }
    for (let i = 0; i < 5; i++) {
      const valueA = values.get(a.card[i]);
      const valueB = values.get(b.card[i]);
      if (valueA > valueB) {
        return 1;
      } else if (valueA < valueB) {
        return -1;
      }
    }
    return 0;
  });
  // console.log(cardRanks);
  let sum = 0;
  cardRanks.forEach((cardRank, index) => {
    const bid = bids.get(cardRank.card);
    sum += bid * (index + 1);
  });
  console.log(sum);
});
