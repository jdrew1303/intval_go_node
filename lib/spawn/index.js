'use strict';

const spawnRaw = require('child_process').spawn;

function spawn (cmd, args) {
    const p = new Promise((resolve, reject) => {
        const sp = spawnRaw(cmd, args);
        let output = '';
        sp.stderr.on('data', (data) => {
            output += data;
            console.log(`${data}`);
        });
        sp.on('close', (code) => {
            return resolve(output);
        });
    });
    return p;
}

module.exports = spawn;