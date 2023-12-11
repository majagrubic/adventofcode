const { parse } = require('path');
const path = require("path");

const lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('input.txt'),
});

const data = [];
let galaxies = [];
let row = 0;
let paths = [];

function getGalaxyAtPosition(row, col) {
    let galaxyIndex = 0;
    galaxies.forEach((galaxy, index) => {
        if (galaxy[0] === row && galaxy[1] === col) {
            galaxyIndex = index;
            return;
        }
    })
    return galaxyIndex;
}

function dfs(startingPoint) {
    const galaxy = galaxies[startingPoint];
    const visited = Array.from({ length: data.length }, () => Array(data[0].length).fill(false));
    const queue = [[galaxy[0], galaxy[1], 0]];
    const pathLengths = Array(galaxies.length).fill(0);
    while (queue.length !== 0) {
        const point = queue.shift();
        const row = point[0];
        const col = point[1];
        const length = point[2];
        if (
            row < 0 ||
            row >= data.length ||
            col < 0 ||
            col >= data[0].length ||
            visited[row][col]
        ) {
            continue;
        }
        if (data[row][col] === '#') {
            const index = getGalaxyAtPosition(row, col);
            pathLengths[index] = length;
        }
        visited[row][col] = true;
        queue.push([row + 1, col, length + 1]);
        queue.push([row - 1, col, length + 1]);
        queue.push([row, col + 1, length + 1]);
        queue.push([row, col - 1, length + 1]);
    }
    paths.push(pathLengths);
}

lineReader.on('line', function (line) {
    data.push(line);
    const y = line.indexOf('#');
    if (y === -1) {
        data.push(line);
    }
    row++;
});

lineReader.on('close', function () {
    let j = 0;
    while(j < data[0].length) {
        const column = [];
        for (let i = 0; i < data.length; i++) {
            column.push(data[i][j]);
        }
        if (column.includes('#')) {
            j++;
            continue;
        }
        for (let i = 0; i < data.length; i++) {
            const newRow = [...data[i]];
            newRow.splice(j, 0, '.');
            data[i] = newRow;
        }
        j += 2;
    }

    galaxies = [];
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[0].length; j++) {
            if (data[i][j] === '#') {
                galaxies.push([i, j]);
            }
        }
    }
    galaxies.forEach((galaxy, index) => {
        dfs(index);
    });
    let sum = 0;
    for (let i = 0; i < paths.length; i++) {
        for (let j = i + 1; j < paths[0].length; j++) {
            sum += paths[i][j];
        }
    }
    console.log(sum);
});
