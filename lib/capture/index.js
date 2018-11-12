'use strict';

const req = require('request');

const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;
const parser = new Readline('');
const newlineRe = new RegExp('\n', 'g');
const returnRe = new RegExp('\r', 'g');

const exec = require('exec');
const delay = require('delay');

let system = {};

async function capture_frame () {
	let framePath = `${VIDEO}/frame`;
	let res;
	try{
		res = await req.get(framePath);
	} catch (err) {
		return exit('Error triggering frame', 8);
	}
	if (res) {
		console.log(res);
	}
	return true;
}

function capture () {

}

module.exports = (sys) => {
	system = sys;
	return capture;
}