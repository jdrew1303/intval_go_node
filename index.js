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

function delay (ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

function args () {
	INTVAL = process.argv[process.argv.length - 2];
	VIDEO = process.argv[process.argv.length - 1];
	if (INTVAL.indexOf('/index.js') !== -1 || INTVAL.indexOf('/bin/node') !== -1) {
		exit('Requires 2 arguments', 1)
	}

}

async function sequence (info) {

}

async function ffmpeg_frame (time) {
	//ffmpeg -i ${VIDEO} -ss 00:00:07.000 -vframes 1 thumb.jpg

	//ffmpeg -i ${VIDEO} -compression_algo raw -pix_fmt rgb24 output.tiff
}

async function display_frame (frame) {
	//timeout 3 eog --fullscreen ${frame}
}


async function ffprobe () {
	let cmd = `ffprobe -v quiet -print_format json -show_format -show_streams "${VIDEO}"`
	let exists;
	try {
		exists = await fs.exists(VIDEO);
	} catch (err) {
		return exit(err, 5);
	}
	if (!exists) {
		return exit(`File ${VIDEO} does not exist`, 6);
	}
	return asyncExec(cmd);
}

async function ffprobe_frames () {
	let cmd = `ffprobe -v error -count_frames -select_streams v:0 -show_entries stream=nb_read_frames -of default=nokey=1:noprint_wrappers=1 ${VIDEO}`;
	return asyncExec(cmd);
}

async function main () {
	let info;
	let frames;
	//check dependencies (ffmpeg, eog, preview)
	try {
		await dependencies();
	} catch (err) {
		//will exit process on error
	}
	//parse arguments
	args();
	
	try {
		info = await ffprobe();
	} catch (err) {
		return exit(err, 2);
	}
	try {
		frames = await ffprobe_frames();
	} catch (err) {
		return exit(err, 3);
	}
	if (info && frames) {
		info = JSON.parse(info);
		frames = parseInt(frames);
		//console.dir(info);
		console.log(frames);
		//for loop exporting video
	} else {
		return exit('')
	}
}

main();