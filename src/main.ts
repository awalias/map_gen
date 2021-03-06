"use strict";

import {rand} from './utils';
import {MapGen} from './MapGen';
import names_json from './city_label_dictionary.json';
import suffixes_json from './city_label_suffixes.json';

window.label_font_size = 14;

window.onload = function() {
  window.dispatchEvent(new Event('resize'));

  const MAP_RADIUS = 250;
  const NUMBER_OF_GUIDE_POINTS = 15;
  const DEBUG_MODE = false;
  const NAMES = names_json.names;
  const SUFFIXES = suffixes_json.names;

  var canvas = <HTMLCanvasElement> document.getElementById('map');
  var c = canvas.getContext('2d');
  var background_texture = new Image();
  let texture_style = "default";
  background_texture.src =  "./assets/" + texture_style +"/bg" + rand(1,53) + ".png";


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

  let btn_regenerate = document.getElementById("btn-regenerate");
  btn_regenerate.addEventListener("click", (e:Event) => regenerate());

  let btn_classic = document.getElementById("btn-classic");
  btn_classic.addEventListener("click", (e:Event) => setStyle("default"));

  let btn_retro = document.getElementById("btn-retro");
  btn_retro.addEventListener("click", (e:Event) => setStyle("retro"));

  let btn_download = document.getElementById("btn-download");
  btn_download.addEventListener("click", (e:Event) => download_canvas(btn_download));

  function setStyle(tex: string) {
    if (tex === "default") {
      let btn_retro = document.getElementById("btn-retro");
      let btn_classic = document.getElementById("btn-classic");
      btn_retro.classList.remove("active");
      btn_classic.classList.add("active");
    } else {
      let btn_retro = document.getElementById("btn-retro");
      let btn_classic = document.getElementById("btn-classic");
      btn_retro.classList.add("active");
      btn_classic.classList.remove("active");
    }
    texture_style = tex;
    regenerate();
  }

  function download_canvas(el) {
    mixpanel.track(
      "Map downloaded",
      {"texture_style": texture_style}
      );
    var image = canvas.toDataURL("image/jpg");
    el.href = image;
    console.log(el);
  }

  function regenerate() {
    mixpanel.track("New map generated",
      {"texture_style": texture_style}
      );
    document.getElementById('map').style.visibility = 'hidden';
    background_texture.src =  "./assets/" + texture_style +"/bg" + rand(1,53) + ".png";
  }

  background_texture.onload = function() {
    document.body.style.backgroundColor = palette[texture_style]['sea'];
    var mg = new MapGen(c, NUMBER_OF_GUIDE_POINTS, MAP_RADIUS, DEBUG_MODE, NAMES, SUFFIXES,
      background_texture, palette[texture_style]['sea'], palette[texture_style]['road'], palette[texture_style]['border'],
      500, 500, label_font_size);
    mg.plot().then(function(){
      mg.draw();
    });
  }
}

window.addEventListener("resize", function() {
  if (window.matchMedia("(min-width: 500px)").matches) {
    window.label_font_size = 14;
  } else {
    window.label_font_size = 18;
  }
});
