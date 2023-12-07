const { parse } = require('path');

const lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('input.txt'),
});

//for the first part
let sum = 0;
let times = [];
let distances = [];
let time = 0;
let distance = 0;

lineReader.on('line', function (line) {
  const parts = line.split(': ');
  const value = parts[1].trim().split(' ').join('');
  if (parts[0].includes('Time')) {
    time = parseInt(value);
  } else {
    distance = parseInt(value);
  }
});

lineReader.on('close', function () {
  const waysToWin = [];
  //for (let i = 0; i < times.length; i++) {
  let winningTimes = 0;
  const duration = time;
  for (let t = 0; t <= duration; t++) {
    const speed = t;
    const remainingTime = duration - t;
    const currentDistance = speed * remainingTime;
    // console.log(time + ' ' + distance);
    if (currentDistance > distance) {
      winningTimes++;
    }
  }
  //console.log('===');
  waysToWin.push(winningTimes);
  //console.log(winningTimes);
  //  }
  const result = waysToWin.reduce((a, b) => a * b, 1);
  console.log(result);
});
