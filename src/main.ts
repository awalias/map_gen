"use strict";

import {rand} from './utils';
import {MapGen} from './MapGen';

const MAP_RADIUS = 250;
const NUMBER_OF_GUIDE_POINTS = 15;
const DEBUG_MODE = false;

var canvas = <HTMLCanvasElement> document.getElementById('map');
var c = canvas.getContext('2d');

var mg = new MapGen(c, NUMBER_OF_GUIDE_POINTS, MAP_RADIUS, DEBUG_MODE);

mg.plot();
mg.draw();
