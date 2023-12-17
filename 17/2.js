const { parse } = require('path');
const path = require('path');

const data = [];

const lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('input.txt'),
});

lineReader.on('line', function (line) {
  const lineArr = line.split('').map((ch) => parseInt(ch));
  data.push(lineArr);
});

class PriorityQueue {
  constructor() {
    this.queue = [];
  }

  enqueue(element, priority) {
    this.queue.push({ element, priority });
    this.sortQueue();
  }

  dequeue() {
    if (this.isEmpty()) {
      return null;
    }
    return this.queue.shift().element;
  }

  isEmpty() {
    return this.queue.length === 0;
  }

  sortQueue() {
    this.queue.sort((a, b) => a.priority - b.priority);
  }
}

function dijkstra(matrix) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const visited = new Set();
  const priorityQueue = new PriorityQueue();
  priorityQueue.enqueue(
    {
      row: 0,
      col: 0,
      steps: 0,
      direction: { row: 0, col: 0 },
      priority: 0,
    },
    0
  );

  while (!priorityQueue.isEmpty()) {
    const current = priorityQueue.dequeue();
    const { row, col, steps, direction, priority } = current;
    if (row === rows - 1 && col === cols - 1 && steps >= 4) {
      return priority;
    }
    const hash =
      row + ',' + col + ',' + direction.row + ',' + direction.col + ',' + steps;
    if (visited.has(hash)) {
      continue;
    }
    visited.add(hash);
    if (steps < 10) {
      const newRow = row + direction.row;
      const newCol = col + direction.col;

      if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
        const newPriority = priority + matrix[newRow][newCol];
        priorityQueue.enqueue(
          {
            row: newRow,
            col: newCol,
            steps: steps + 1,
            direction,
            priority: newPriority,
          },
          newPriority
        );
      }
    }
    if (steps >= 4 || [direction.row, direction.col].every((c) => c === 0)) {
      for (const [directionRow, directionCol] of [
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0],
      ]) {
        if (
          JSON.stringify([directionRow, directionCol]) !==
            JSON.stringify([direction.row, direction.col]) &&
          JSON.stringify([directionRow, directionCol]) !==
            JSON.stringify([-direction.row, -direction.col])
        ) {
          const newRow = row + directionRow;
          const newCol = col + directionCol;

          if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
            const newPriority = priority + matrix[newRow][newCol];
            priorityQueue.enqueue(
              {
                row: newRow,
                col: newCol,
                direction: { row: directionRow, col: directionCol },
                priority: newPriority,
                steps: 1,
              },
              newPriority
            );
          }
        }
      }
    }
  }
  return 0;
}

lineReader.on('close', function () {
  const sum = dijkstra(data);
  console.log(sum);
});
