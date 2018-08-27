'use strict';

const exec = require('child_process').exec;
const os = require('os');
const fs = require('fs-extra');
const req = require('request');

let INTVAL;
let VIDEO;

function exit (msg, code = 0) {
	if (code === 0) {
		console.log(msg);
		process.exit();
	} else {
		console.error(msg);
		process.exit(code);
	}
}

async function asyncExec (cmd) {
	return new Promise((resolve, reject) => {
		return exec(cmd, (err, stdio, stderr) => {
			if (err) return reject(err);
			return resolve(stdio);
		});
	});
}

async function dependencies () {
	try {
		await asyncExec('ffmpeg -h');
	} catch (err) {
		return exit('ffmpeg is not installed', 3);
	}
	//if linux
	try {
		await asyncExec('eog -h');
	} catch (err) {
		return exit('eog is not installed', 4);
	}
}

function args () {
	INTVAL = process.argv[process.argv.length - 2];
	VIDEO = process.argv[process.argv.length - 1];
	if (INTVAL.indexOf('/index.js') !== -1 || INTVAL.indexOf('/bin/node') !== -1) {
		exit('Requires 2 arguments', 1)
	}
}

async function ffmpeg_frame () {
	//ffmpeg -i ${VIDEO} -ss 00:00:07.000 -vframes 1 thumb.jpg

	//ffmpeg -i ${VIDEO} -compression_algo raw -pix_fmt rgb24 output.tiff
}


async function ffprobe () {
	let cmd = `ffprobe -v quiet -print_format json -show_format -show_streams "${VIDEO}"`
	return asyncExec(cmd);
}

async function main () {
	let info;
	//check dependencies (ffmpeg, eog, preview)
	await dependencies();
	//parse arguments
	args();
	//for loop exporting video
	try {
		info = await ffprobe();
	} catch (err) {
		return exit(err, 2);
	}
	if (info) {
		info = JSON.parse(info);
		console.dir(info);
	}
}

main();