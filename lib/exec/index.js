'use strict';

const exec = require('child_process').exec;

async function asyncExec (cmd) {
	return new Promise((resolve, reject) => {
		return exec(cmd, (err, stdio, stderr) => {
			if (err) return reject(err);
			return resolve(stdio);
		});
	});
}

module.exports = asyncExec;