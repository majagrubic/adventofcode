const { parse } = require('path');

const lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('input.txt'),
});

let data = [];
let path = [];

function nextPointInSameDirection(row, col, direction) {
  switch (direction) {
    case 'R':
      return [row, col + 1];
    case 'L':
      return [row, col - 1];
    case 'U':
      return [row - 1, col];
    case 'D':
      return [row + 1, col];
  }
}

function dfs(visited, row, col, direction) {
  if (row >= data.length || row < 0 || col >= data[0].length || col < 0) {
    return;
  }
  const hash = [row, col, direction].join(',');
  const point = data[row][col];
  if (visited.has(hash)) {
    return;
  }
  visited.add(hash);
  path[row][col] = '#';
  switch (point) {
    case '.':
      const [nextRow, nextCol] = nextPointInSameDirection(row, col, direction);
      dfs(visited, nextRow, nextCol, direction);
      break;
    case '-':
      if (direction === 'L' || direction === 'R') {
        const [nextRow, nextCol] = nextPointInSameDirection(
          row,
          col,
          direction
        );
        dfs(visited, nextRow, nextCol, direction);
      } else {
        dfs(visited, row, col + 1, 'R');
        dfs(visited, row, col - 1, 'L');
      }
      break;
    case '|':
      if (direction === 'U' || direction === 'D') {
        const [nextRow, nextCol] = nextPointInSameDirection(
          row,
          col,
          direction
        );
        dfs(visited, nextRow, nextCol, direction);
      } else {
        dfs(visited, row + 1, col, 'D');
        dfs(visited, row - 1, col, 'U');
      }
      break;
    case '/':
      if (direction === 'R') {
        dfs(visited, row - 1, col, 'U');
      } else if (direction === 'L') {
        dfs(visited, row + 1, col, 'D');
      } else if (direction === 'U') {
        dfs(visited, row, col + 1, 'R');
      } else {
        dfs(visited, row, col - 1, 'L');
      }
      break;
    case '\\':
      if (direction === 'R') {
        dfs(visited, row + 1, col, 'D');
      } else if (direction === 'L') {
        dfs(visited, row - 1, col, 'U');
      } else if (direction === 'U') {
        dfs(visited, row, col - 1, 'L');
      } else {
        dfs(visited, row, col + 1, 'R');
      }
      break;
  }
}

function printData(data) {
  for (let row = 0; row < data.length; row++) {
    console.log(data[row].join(''));
  }
  console.log('');
}

lineReader.on('line', function (line) {
  const lineArr = line.split('');
  data.push(lineArr);
  path.push([...lineArr]);
});

lineReader.on('close', function () {
  const visited = new Set();
  const calculateSum = () => {
    let sum = 0;
    for (let row = 0; row < data.length; row++) {
      for (let col = 0; col < data[0].length; col++) {
        if (path[row][col] === '#') {
          sum++;
        }
      }
    }
    return sum;
  };
  let sums = [];
  for (let row = 0; row < data.length; row++) {
    path = new Array(data.length)
      .fill('.')
      .map(() => new Array(data[0].length).fill('.'));
    dfs(new Set(), row, 0, 'R');
    sums.push(calculateSum());

    path = new Array(data.length)
      .fill('.')
      .map(() => new Array(data[0].length).fill('.'));
    dfs(new Set(), row, data[0].length - 1, 'L');
    sums.push(calculateSum());
  }

  for (let j = 0; j < data[0].length; j++) {
    path = new Array(data.length)
      .fill('.')
      .map(() => new Array(data[0].length).fill('.'));
    dfs(new Set(), 0, j, 'D');
    sums.push(calculateSum());

    path = new Array(data.length)
      .fill('.')
      .map(() => new Array(data[0].length).fill('.'));
    dfs(new Set(), data.length - 1, j, 'U');
    sums.push(calculateSum());
  }

  console.log(Math.max(...sums));
});
