const { parse } = require('path');

const lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('input.txt'),
});
const points = [];
let lineNr = 0;
let cols = 0;
let startingPoint;

function dfs(distances, row, col, initialCount, initialDirection) {
  const visited = Array.from({ length: lineNr }, () => Array(cols).fill(false));
  const queue = [[row, col, initialDirection]];
  let count = initialCount;
  while (queue.length !== 0) {
    const point = queue.pop();
    const row = point[0];
    const col = point[1];
    const direction = point[2];
    if (
      visited[row][col] ||
      row < 0 ||
      row >= points.length ||
      col < 0 ||
      col >= cols ||
      points[row][col] === '.'
    ) {
      continue;
    }
    if (points[row][col] === 'S') {
      return;
    }
    count = count + 1;
    visited[row][col] = true;
    distances[row][col] =
      distances[row][col] !== 0 ? Math.min(distances[row][col], count) : count;
    switch (points[row][col]) {
      case '|':
        if (direction === 'S') {
          queue.push([row + 1, col, 'S']);
        } else if (direction === 'N') {
          queue.push([row - 1, col, 'N']);
        }
        break;
      case '-':
        if (direction === 'E') {
          queue.push([row, col + 1, 'E']);
        } else if (direction === 'W') {
          queue.push([row, col - 1, 'W']);
        }
        break;
      case 'L':
        if (direction === 'S') {
          queue.push([row, col + 1, 'E']);
        } else if (direction === 'W') {
          queue.push([row - 1, col, 'N']);
        }
        break;
      case 'J':
        if (direction === 'E') {
          queue.push([row - 1, col, 'N']);
        } else if (direction === 'S') {
          queue.push([row, col - 1, 'W']);
        }
        break;
      case 'F':
        if (direction === 'N') {
          queue.push([row, col + 1, 'E']);
        } else if (direction === 'W') {
          queue.push([row + 1, col, 'S']);
        }
        break;
      case '7':
        if (direction === 'N') {
          queue.push([row, col - 1, 'W']);
        } else if (direction === 'E') {
          queue.push([row + 1, col, 'S']);
        }
        break;
    }
  }
}

lineReader.on('line', function (line) {
  const lineArr = line.split('');
  points.push(lineArr);
  cols = line.length;
  const indexOfS = line.indexOf('S');
  if (indexOfS !== -1) {
    startingPoint = [lineNr, indexOfS];
  }
  lineNr++;
});

lineReader.on('close', function (line) {
  const distances = Array.from({ length: lineNr }, () => Array(cols).fill(0));
  dfs(distances, startingPoint[0] + 1, startingPoint[1], 0, 'S');
  dfs(distances, startingPoint[0] - 1, startingPoint[1], 0, 'N');
  dfs(distances, startingPoint[0], startingPoint[1] + 1, 0, 'E');
  dfs(distances, startingPoint[0], startingPoint[1] - 1, 0, 'W');
  //console.log(distances);

  let max = 0;
  for (let i = 0; i < distances.length; i++) {
    for (let j = 0; j < cols; j++) {
      max = Math.max(max, distances[i][j]);
    }
  }
  console.log(max);
});
