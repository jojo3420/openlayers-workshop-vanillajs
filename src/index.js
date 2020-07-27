import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import XYZSource from 'ol/source/XYZ';
import { fromLonLat } from 'ol/proj';

const mapInfoDiv = document.getElementById('map-info');
const ul = mapInfoDiv.querySelector('ul');

const view = new View({
  center: fromLonLat([0, 0]),
  zoom: 2,
  // projection: 'EPSG:',
});

const map = new Map({
  target: 'map-container',
  layers: [
    new TileLayer({
      source: new XYZSource({
        url: 'http://tile.stamen.com/terrain/{z}/{x}/{y}.jpg',
      }),
    }),
  ],
  view,
});
console.log({ ul });
ul.innerHTML = '';
const li1 = document.createElement('li');
const li2 = document.createElement('li');
li1.textContent = 'projection.code_: ' + view.getProjection().code_;
li2.textContent = 'projection.units_: ' + view.getProjection().units_;

ul.appendChild(li1);
ul.appendChild(li2);

// console.log(map.getProperties());
