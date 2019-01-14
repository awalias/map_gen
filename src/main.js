"use strict";

var utils = require('./utils.js')

const BORDER_START_X = 50;
const BORDER_START_Y = 50;
const BORDER_MAX_STEPS = 100;
const MIN_STEP_PIXELS = 2;
const MAX_STEP_PIXELS = 10;

var canvas = document.getElementById('map');
var c = canvas.getContext('2d');

c.beginPath(); 
c.moveTo(BORDER_START_X, BORDER_START_Y);

var x = BORDER_START_X;
var y = BORDER_START_Y;
for (var i=0; i<BORDER_MAX_STEPS; i++) {
	x = x + utils.rand(MIN_STEP_PIXELS, MAX_STEP_PIXELS);
	y = y + utils.rand(MIN_STEP_PIXELS, MAX_STEP_PIXELS);
    c.lineTo(x, y);
}

c.lineTo(BORDER_START_X, BORDER_START_Y);
c.stroke();
