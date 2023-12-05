const { parse } = require('path');

const lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('input.txt'),
});

let current = 0;

let seeds = [];
const seedToSoil = [];
const soilToFertilizer = [];
const fertilizerToWater = [];
const waterToLight = [];
const lightToTemperature = [];
const temperatureToHumidity = [];
const humidityToLocation = [];

let minLocation = Number.MAX_SAFE_INTEGER;

lineReader.on('line', function (line) {
  if (line.includes('seeds:')) {
    const seedsList = line.split('seeds: ')[1].split(' ');
    for (let i = 0; i < seedsList.length; i = i + 2) {
      const start = parseInt(seedsList[i]);
      const end = start + parseInt(seedsList[i + 1]);
      seeds.push([start, end]);
    }
  } else if (line.includes('seed-to-soil')) {
    current = 1;
  } else if (line.includes('soil-to-fertilizer')) {
    current = 2;
  } else if (line.includes('fertilizer-to-water')) {
    current = 3;
  } else if (line.includes('water-to-light')) {
    current = 4;
  } else if (line.includes('light-to-temperature')) {
    current = 5;
  } else if (line.includes('temperature-to-humidity')) {
    current = 6;
  } else if (line.includes('humidity-to-location')) {
    current = 7;
  } else {
    const parts = line.split(' ');
    const range = parseInt(parts[2]);
    const source = parseInt(parts[1]);
    const destination = parseInt(parts[0]);

    switch (current) {
      case 1:
        seedToSoil.push([source, destination, range]);
        break;
      case 2:
        soilToFertilizer.push([source, destination, range]);
        break;
      case 3:
        fertilizerToWater.push([source, destination, range]);
        break;
      case 4:
        waterToLight.push([source, destination, range]);
        break;
      case 5:
        lightToTemperature.push([source, destination, range]);
        break;
      case 6:
        temperatureToHumidity.push([source, destination, range]);
        break;
      case 7:
        humidityToLocation.push([source, destination, range]);
        break;
    }
  }
});

lineReader.on('close', function () {
  seeds.forEach(([start, end]) => {
    for (let i = start; i < end; i++) {
      const seed = i;
      let soil = seed;
      seedToSoil.forEach((entry) => {
        // 0 - seed
        // 1 - soil
        // 2 - range
        if (seed >= entry[0] && seed < entry[0] + entry[2]) {
          const offset = seed - entry[0];
          soil = entry[1] + offset;
        }
      });
      let fertilizer = soil;
      soilToFertilizer.forEach((entry) => {
        if (soil >= entry[0] && soil < entry[0] + entry[2]) {
          const offset = soil - entry[0];
          fertilizer = entry[1] + offset;
        }
      });
      let water = fertilizer;
      fertilizerToWater.forEach((entry) => {
        if (fertilizer >= entry[0] && fertilizer < entry[0] + entry[2]) {
          const offset = fertilizer - entry[0];
          water = entry[1] + offset;
        }
      });
      let light = water;
      waterToLight.forEach((entry) => {
        if (water >= entry[0] && water < entry[0] + entry[2]) {
          const offset = water - entry[0];
          light = entry[1] + offset;
        }
      });
      let temperature = light;
      lightToTemperature.forEach((entry) => {
        if (light >= entry[0] && light < entry[0] + entry[2]) {
          const offset = light - entry[0];
          temperature = entry[1] + offset;
        }
      });
      let humidity = temperature;
      temperatureToHumidity.forEach((entry) => {
        if (temperature >= entry[0] && temperature < entry[0] + entry[2]) {
          const offset = temperature - entry[0];
          humidity = entry[1] + offset;
        }
      });
      let location = humidity;
      humidityToLocation.forEach((entry) => {
        if (humidity >= entry[0] && humidity < entry[0] + entry[2]) {
          const offset = humidity - entry[0];
          location = entry[1] + offset;
        }
      });
      minLocation = Math.min(minLocation, location);
    }
  });
  console.log(minLocation);
});
