const { parse } = require("path");

const lineReader = require("readline").createInterface({
  input: require("fs").createReadStream("input.txt"),
});

const isDigit = (symbol) => {
  return symbol >= "0" && symbol <= "9";
};

const fileData = [];
const symbols = [];
let lineNr = 0;

lineReader.on("line", function (line) {
  const lineArr = line.split("");
  fileData.push(lineArr);
  for (let y = 0; y < line.length; y++) {
    const character = line[y];
    if (character === "*") {
      symbols.push([lineNr, y]);
    }
  }
  lineNr++;
});

lineReader.on("close", function () {
  let sum = 0;
  symbols.forEach(([posX, posY]) => {
    let partNumbers = [];
    for (let i = -1; i <= 1; i++) {
      const x = posX + i;
      if (x < 0 || x >= fileData.length) {
        continue;
      }
      for (let j = -1; j <= 1; j++) {
        const y = posY + j;
        if (y < 0 || y >= fileData.length || (i === 0 && j === 0)) {
          continue;
        }
        const character = fileData[x][y];
        if (!isDigit(character)) {
          continue;
        }
        fileData[x][y] = ".";
        //go left
        let pos = y - 1;
        let digits = [character];
        while (pos >= 0 && isDigit(fileData[x][pos])) {
          digits.push(fileData[x][pos]);
          fileData[x][pos] = ".";
          pos--;
        }
        digits.reverse();

        //go right
        pos = y + 1;
        while (pos < fileData[x].length && isDigit(fileData[x][pos])) {
          digits.push(fileData[x][pos]);
          fileData[x][pos] = ".";
          pos++;
        }
        const number = parseInt(digits.join(""));
        partNumbers.push(number);
      }
    }
    if (partNumbers.length === 2) {
      sum += partNumbers[0] * partNumbers[1];
    }
  });
  console.log(sum);
});
