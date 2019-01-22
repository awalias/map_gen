"use strict";

import {rand} from './utils';
import {MapGen} from './MapGen';

const MAP_RADIUS = 250;
const NUMBER_OF_GUIDE_POINTS = 15;

var canvas = <HTMLCanvasElement> document.getElementById('map');
var c = canvas.getContext('2d');

var mg = new MapGen(c, NUMBER_OF_GUIDE_POINTS, MAP_RADIUS, true);

mg.plot();
mg.draw();

// Steps
// 
// draw guide points when debug == True