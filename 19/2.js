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
            .map((rule, index) => {
                let r = {};
                if (rule.includes('<') || rule.includes('>')) {
                    const operator = rule.includes('<') ? '<' : '>';
                    const ruleParts = rule.split(operator);
                    const condition = ruleParts[0];
                    const rest = ruleParts[1].split(':');
                    r = {
                        nodeId: name,
                        index,
                        operator,
                        value: parseInt(rest[0]),
                        condition,
                        nextRule: rest[1],
                    };
                } else {
                    r.nextRule = rule;
                    r.nodeId = name;
                    r.index = index;
                }
                return r;
            });
        workflows.set(name, rules);
    }
});

function dfs(node) {
    if (!node) {
        return;
    }
    const { id, state } = node;
    const stateCpy = [...state];
    const rules = workflows.get(id);
    rules.forEach((rule) => {
        const { operator, value, condition } = rule;
        if (operator === '>') {
            const diff = 4000 - value;
            stateCpy[condition] = diff;
            if (nextRule !== 'R') {
                const next = workflows.get(nextRule);
                next.forEach((step) => {
                    queue.push({...step, currentSum: [...currentSum]})
                });
            }

        });
    if (operator === '>') {
            const diff = 4000 - value;
            state[condition] = diff;
            if (nextRule !== 'R') {
                const next = workflows.get(nextRule);
                next.forEach((step) => {
                    queue.push({...step, currentSum: [...currentSum]})
                });
            }
        } else {
            const next = workflows.get(nextRule);
            next.forEach((step) => {
                queue.push({...step, currentSum: [...currentSum]})
            });
        }
    }
}

lineReader.on('close', function () {
    const sum = bfs();
    console.log(sum);
});
