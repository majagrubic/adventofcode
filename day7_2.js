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

function cardRankFromCountMap(countMap) {
  const mapValues = Array.from(countMap.values());
  switch (countMap.size) {
    case 1:
      return 7;
    case 2:
      if (mapValues.includes(1)) {
        return 6;
      } else {
        return 5;
      }
    case 3:
      if (mapValues.includes(3)) {
        return 4;
      } else {
        return 3;
      }
    case 4:
      return 2;
    case 5:
      return 1;
  }
}

lineReader.on('close', function () {
  const strength = new Map();
  const values = new Map();
  'A,K,Q,T,9,8,7,6,5,4,3,2,J'
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
    if (!countMap.has('J')) {
      strength.set(card, { card, rank: cardRankFromCountMap(countMap) });
      return;
    }
    const mapValues = Array.from(countMap.values());
    const jCount = countMap.get('J');
    switch (jCount) {
      case 5:
        // five of a kind
        strength.set(card, { card, rank: 7 });
        break;
      case 4:
        // 1 J J J => can turn into five of a kind
        strength.set(card, { card, rank: 7 });
        break;
      case 3:
        if (countMap.size === 2) {
          // J J J 2
          // can turn into five of a kind
          strength.set(card, { card, rank: 7 });
        } else {
          // J J J 1 1 -> four of a kind
          strength.set(card, { card, rank: 6 });
        }
        break;
      case 2:
        if (countMap.size === 2) {
          // J J 3
          // can turn into five of a kind
          strength.set(card, { card, rank: 7 });
        } else if (countMap.size === 3) {
          // J J 2 1
          // turn one into four of a kind
          strength.set(card, { card, rank: 6 });
        } else {
          // J J 1 1 1
          // three of a kind
          strength.set(card, { card, rank: 4 });
        }
        break;
      case 1:
        if (countMap.size === 2) {
          // J 4
          strength.set(card, { card, rank: 7 });
        } else if (countMap.size === 3) {
          // J 3 1
          // J 2 2
          if (mapValues.includes(2)) {
            // 2 2 J => full house
            strength.set(card, { card, rank: 5 });
          } else {
            // 1 3 J => four of a kind
            strength.set(card, { card, rank: 6 });
          }
        } else if (countMap.size === 4) {
          // 2 1 1 J -> three of a kind
          strength.set(card, { card, rank: 4 });
        } else {
          // one pair
          strength.set(card, { card, rank: 2 });
        }
    }
  });
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
  let sum = 0;
  cardRanks.forEach((cardRank, index) => {
    const bid = bids.get(cardRank.card);
    sum += bid * (index + 1);
  });
  console.log(sum);
});
