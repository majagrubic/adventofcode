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
  //  console.log(hash + ' , '  + direction + ' , ' + point);
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

lineReader.on('line', function (line) {
  const lineArr = line.split('');
  data.push(lineArr);
  path.push([...lineArr]);
});

lineReader.on('close', function () {
  const visited = new Set();
  let sum = 0;
  dfs(visited, 0, 0, 'R');
  for (let row = 0; row < data.length; row++) {
    for (let col = 0; col < data[0].length; col++) {
      if (path[row][col] === '#') {
        sum++;
      }
    }
  }
  console.log(sum);
});
