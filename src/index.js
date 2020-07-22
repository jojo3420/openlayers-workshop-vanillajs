import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import XYZSource from 'ol/source/XYZ';
import { fromLonLat, toLonLat } from 'ol/proj';
import Overlay from 'ol/overlay';
import { toStringHDMS } from 'ol/coordinate';
import TileJSON from 'ol/source/TileJSON';

// example source
// https://openlayers.org/en/latest/examples/popup.html?q=popup

/**
 * Elements that make up the popup.
 */
const container = document.querySelector('#popup');
const content = document.querySelector('#popup-content');
const closer = document.querySelector('.ol-popup-closer');

// console.log({ container, content, closer });
const overlay = new Overlay({
  element: container,
  authPan: true,
  autoPanAnimation: {
    duration: 250,
  },
});

/**
 * Add a click handler to hide the popup.
 * @return {boolean} Don't follow the href.
 */
closer.onclick = function () {
  overlay.setPosition(null);
  closer.blur();
  return false;
};

const map = new Map({
  target: 'map-container',
  layers: [
    new TileLayer({
      source: new XYZSource({
        url: 'http://tile.stamen.com/terrain/{z}/{x}/{y}.jpg',
      }),
    }),
  ],
  overlays: [overlay],
  view: new View({
    center: fromLonLat([0, 0]),
    zoom: 2,
  }),
});

/**
 * Add a click handler to the map to render the popup.
 */
map.on('singleclick', function (e) {
  const coordinate = e.coordinate;
  console.log({ coordinate });
  const hdms = toStringHDMS(toLonLat(coordinate));
  console.log({ hdms });
  content.innerHTML = `
      <p>You clicked here: </p>
      <code>${hdms}</code>
      <div>this is popup content</div>       
  `;
  overlay.setPosition(coordinate);
});
