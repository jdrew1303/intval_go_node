'use strict';

const { remote, ipcRenderer } = require('electron');
const dialog 	= require('electron').remote.dialog;

var changeMethod = function () {
	const radios = document.getElementsByName('method');
	let val;
	for (let i = 0, length = radios.length; i < length; i++) {
 		if (radios[i].checked) {
			val = radios[i].value;
  			break;
 		}
	}
	if (val === 'intval3') {
		hide('arduino');
		show('intval3');
	} else if (val === 'arduino') {
		hide('intval3');
		show('arduino');
	}
	msg({ type : 'method', method : val });
};

var changeFile = function () {
	let name = document.getElementById('video').value;
	name = name.split("\\").pop();
	let path = document.getElementById('video').files[0].path;
	//alert(name);
	//alert(document.getElementById('video').files[0].path);
	document.getElementById('info').innerHTML = `Identifying...

	`
	msg({ type: 'video', video : path, name });
};

var hide = function (id) {
	let elem = document.getElementById(id);
	if (!elem.classList.contains('hide')) {
		elem.classList.add('hide');
	}
};

var show = function (id) {
	let elem = document.getElementById(id);
	if (elem.classList.contains('hide')) {
		elem.classList.remove('hide');
	}
};

var displayInfo = function (obj) {
	let msg = `Video: ${obj.name}
Size: ${obj.info.width}x${obj.info.height}
Frames: ${obj.frames}`;

	show('info');
	document.getElementById('info').innerHTML = msg;
}

var displaySystem = function (obj) {
	let msg = `Platform: ${obj.system.platform}
Monitor:${obj.system.displays[0].width}x${obj.system.displays[0].height}`;

	document.getElementById('system').innerHTML = msg;
}

var start = function () {
	let name = document.getElementById('video').value;
	name = name.split("\\").pop();
	let path = document.getElementById('video').files[0].path;
	document.getElementById('info').innerHTML = `Processing...

	`
	msg({ type: 'start' , name, video : path });
}

var msg = function (obj) {
	ipcRenderer.send('msg', obj);
};

var parseMsg = function (obj) {
	console.dir(obj)
	if (obj.type === 'info') {
		displayInfo(obj);
	} else if (obj.type === 'system') {
		displaySystem(obj);
	}
};

ipcRenderer.on('msg', (event, args) => {
 	//console.dir(event);
 	//console.dir(args);
 	parseMsg(args);
});