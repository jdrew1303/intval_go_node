'use strict';

const path = require('path');
const { BrowserWindow } = require('electron');

const exec = require('exec');
//const spawn = require('spawn');
const delay = require('delay');

let dig;
let system = {};
let digitalWindow;

class Digital {
	constructor() {

	}
	async open () {
		digitalWindow = new BrowserWindow({
			webPreferences: {
      			nodeIntegration: true,
      			allowRunningInsecureContent: false,
      			'unsafe-eval' : false
    		},
			width: 800, 
			height: 600,
			minWidth : 800,
			minHeight : 600//,
			//icon: path.join(__dirname, '../../assets/icons/icon.png')
		});
		digitalWindow.loadURL('file://' + __dirname + '../../../display.html');
		if (process.argv.indexOf('-d') !== -1 || process.argv.indexOf('--dev') !== -1) {
			digitalWindow.webContents.openDevTools();
		}
		digitalWindow.on('closed', () => {
			digitalWindow = null
		});
	}
	async fullScreen () {
		return digitalWindow.setFullScreen(true);
	}
	async setImage (src) {
		return digitalWindow.webContents.send('display', { src });
	}
	async setMeter () {
		return digitalWindow.webContents.send('display', { meter : true });
	}
	async setGrid () {
		return digitalWindow.webContents.send('display', { grid : true });
	}
	async close () {
		if (digitalWindow) {
			digitalWindow.close();
		}
		return true
	}
	async move () {

	}
}



async function display_frame (frame, time) {
	//timeout 3 eog --fullscreen ${frame}
}


async function display (frame, ms) {
	await delay(1000);
	
	await dig.open();
	await dig.fullScreen();
	await dig.setMeter();
	await delay(12000)
	await dig.close();
}

module.exports = function (sys) {
	system = sys;
	dig = new Digital();
	return display;
}