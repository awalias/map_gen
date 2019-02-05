"use strict";

import {rand} from './utils';
import {MapGen} from './MapGen';
import names_json from './city_label_dictionary.json';
import suffixes_json from './city_label_suffixes.json';

const MAP_RADIUS = 250;
const NUMBER_OF_GUIDE_POINTS = 15;
const DEBUG_MODE = false;
const NAMES = names_json.names;
const SUFFIXES = suffixes_json.names;

var canvas = <HTMLCanvasElement> document.getElementById('map');
var c = canvas.getContext('2d');
var mg = new MapGen(c, NUMBER_OF_GUIDE_POINTS, MAP_RADIUS, DEBUG_MODE, NAMES, SUFFIXES);

mg.plot().then(function(){
  mg.draw();
})
