const { parse } = require('path');
const fs = require('node:fs');
const path = require('path');

const lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('input.txt'),
});

let readingWorkflows = true;
const workflows = new Map();
const parts = [];

lineReader.on('line', function (line) {
  if (line.length === 0) {
    readingWorkflows = false;
    return;
  }
  if (readingWorkflows) {
    const lineParts = line.split('{');
    const name = lineParts[0];
    const rules = lineParts[1]
      .substring(0, lineParts[1].length - 1)
      .split(',')
      .map((rule) => {
        let r = {};
        if (rule.includes('<') || rule.includes('>')) {
          const operator = rule.includes('<') ? '<' : '>';
          const ruleParts = rule.split(operator);
          const condition = ruleParts[0];
          const rest = ruleParts[1].split(':');
          r = {
            operator,
            value: parseInt(rest[0]),
            condition,
            nextRule: rest[1],
          };
        } else {
          r.nextRule = rule;
        }
        return r;
      });
    workflows.set(name, rules);
  } else {
    const values = line.substring(1, line.length - 1).split(',');
    const p = {};
    values.forEach((value) => {
      const s = value.split('=');
      const val = parseInt(s[1]);
      p[s[0]] = val;
    });
    parts.push(p);
  }
});

lineReader.on('close', function () {
  const isAccepted = (rule) => rule === 'A';
  const isRejected = (rule) => rule === 'R';

  const getNextStep = (rule) => {
    let accepted = false;
    let rejected = false;
    let id;
    if (isAccepted(rule)) {
      accepted = true;
    } else if (isRejected(rule)) {
      rejected = true;
    } else {
      id = rule;
    }
    return [accepted, rejected, id];
  };

  let sum = 0;
  parts.forEach((part) => {
    let id = 'in';
    let accepted = false;
    let rejected = false;
    let nextId;
    while (!accepted && !rejected) {
      const workflow = workflows.get(id);
      for (let i = 0; i < workflow.length; i++) {
        const wp = workflow[i];
        if (wp.operator === '>' || wp.operator === '<') {
          const { condition, value, nextRule } = wp;
          if (wp.operator === '>' && part[condition] > value) {
            [accepted, rejected, nextId] = getNextStep(nextRule);
            id = nextId;
            break;
          } else if (wp.operator === '<' && part[condition] < value) {
            [accepted, rejected, nextId] = getNextStep(nextRule);
            id = nextId;
            break;
          }
        } else {
          [accepted, rejected, nextId] = getNextStep(wp.nextRule);
          id = nextId;
          break;
        }
      }
    }
    if (accepted) {
      sum += part.a;
      sum += part.x;
      sum += part.m;
      sum += part.s;
    }
  });
  console.log(sum);
});
