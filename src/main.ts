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
var background_texture = new Image();
let texture_style = rand(0,1) ? "default" : "retro";
background_texture.src =  "../assets/" + texture_style +"/bg" + rand(1,53) + ".png";

console.log(background_texture.src);

let palette = {
  'default' : {
    'sea' : '#aadaff',
    'road' : '#ffeba1',
    'border' : '#a8a8a8'
  },
  'retro' : {
    'sea' : '#b9d3c2',
    'road' : '#f6c766',
    'border' : '#EEEEEE'
  }
} 
background_texture.onload = function() {
  var mg = new MapGen(c, NUMBER_OF_GUIDE_POINTS, MAP_RADIUS, DEBUG_MODE, NAMES, SUFFIXES,
    background_texture, palette[texture_style]['sea'], palette[texture_style]['road'], palette[texture_style]['border']);
  mg.plot().then(function(){
    mg.draw();
  });
}
