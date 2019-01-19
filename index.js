'use strict';

const electron = require('electron');
const { Menu, MenuItem, ipcMain, BrowserWindow, app } = electron;
const os = require('os');
const req = require('request');

const system = require('system');

const delay = require('delay');
const exit = require('exit');

let capture;
let display;
let ffmpeg;
let ffprobe;

let mainWindow;
let menu;

let SYSTEM;
let RUNNING = false;
let COUNT = 0;
let LENGTH = 0;
let VIDEO;

/**
 * Parse a message from the main window. Calls the appropriate function.
 * 
 * @param {Object} evt
 * @param {Object} obj Data from message
 **/

async function parseMsg(evt, obj) {
	let info;
	let frames;
	if (obj.type === 'start') {
		start();
	} else if (obj.type === 'method') {

	} else if (obj.type === 'video') {

		try {
			info = await ffprobe.info(obj.video);
		} catch (err) {
			console.error(err);
		}
		try {
			frames = await ffprobe.frames(obj.video);
		} catch (err) {
			console.error(err);
		}

		VIDEO = obj.video;
		LENGTH = frames;

		//console.dir(info)
		//console.log(frames)
		send({ type : 'info', info, frames, name : obj.name, path : obj.video });
	}
}

/**
 * Send a message to the main window.
 *
 * @param {Object} evt Data of the message
 */

async function send (obj) {
	mainWindow.send('msg', obj);
}

/**
 * Create menu from a menu.json config file.
 *
 */
function createMenu () {
	const template = require('./data/menu.json');
	menu = Menu.buildFromTemplate(template);
	Menu.setApplicationMenu(menu);
}

/**
 * Create the main window.
 */

async function createWindow () {
	mainWindow = new BrowserWindow({
		webPreferences: {
      		nodeIntegration: true,
      		allowRunningInsecureContent: false
    	},
		width: 300, 
		height: 400,
		minWidth : 300,
		minHeight : 400//,
		//icon: path.join(__dirname, 'assets/icons/icon.png')
	});
	mainWindow.loadURL('file://' + __dirname + '/index.html');
	if (process.argv.indexOf('-d') !== -1 || process.argv.indexOf('--dev') !== -1) {
		mainWindow.webContents.openDevTools();
	}
	mainWindow.on('closed', () => {
		mainWindow = null;
	});

	ipcMain.on('msg', parseMsg);

	return true;
}

/**
 * Initialize process.
 */
async function init () {
	try {
		SYSTEM = await system();
	} catch (err) {
		console.error(err);
	}

	capture = require('capture')(SYSTEM);
	display = require('display')(SYSTEM);
	ffmpeg = require('ffmpeg')(SYSTEM);
	ffprobe = require('ffprobe')(SYSTEM);

	console.dir(SYSTEM);

	await createWindow();

	await delay(200);

	send({ type: 'system', system : SYSTEM });
}

/**
 * Start showing video.
 */
async function start () {
	console.log(`Started sequence of video '${VIDEO}'`);

	RUNNING = true;
	COUNT = 0;

	for (let i = 0; i < LENGTH; i++) {
		console.log(`${i}:${LENGTH}`);
		if (i === LENGTH) RUNNING = false;

		if (!RUNNING) {
			console.log('Sequence stopped');
			break;
		} else {
			try {
				await step();
			} catch (err) {
				console.error(err);
			}
		}
	}
}

/**
 * Export and display each frame.
 */
async function step () {
	if (RUNNING) {
		//render frame
		try {
			await ffmpeg.frame(VIDEO, COUNT);
		} catch (err) {
			console.error(err);
		}

		display.start(COUNT);
		await delay(5000);
		display.end();
		//wipe frame
		try {
			await ffmpeg.clear(COUNT);
		} catch (err) {
			console.error(err);
		}
		COUNT++;
	}
}

app.on('ready', init);

app.on('window-all-closed', app.quit);

app.on('activate', () => {
	if (mainWindow === null) {
		createWindow();
	}
});