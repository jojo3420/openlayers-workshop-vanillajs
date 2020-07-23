import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import XYZSource from 'ol/source/XYZ';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Icon, Style } from 'ol/style';
import { toSize } from 'ol/size';
import Overlay from 'ol/Overlay';
// import $ from 'jquery';
// import 'bootstrap';

// Icon Symbolize
// https://openlayers.org/en/latest/examples/icon.html?q=marker

// point icon url
const src =
  'data:image/png;base64,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';

const iconFeature = new Feature({
  geometry: new Point(fromLonLat([1, 1])),
  name: 'My Island',
  population: 4000,
  rainfall: 500,
});
const iconStyle = new Style({
  image: new Icon({
    anchor: [0.5, 46],
    anchorXUnits: 'fraction',
    anchorYUnits: 'pixels',
    src: src,
    // size: pixel 단위
    size: toSize([100, 200]) || [100, 400],
    // sale: 0.5,
  }),
});

iconFeature.setStyle(iconStyle);

// Create point layer
const vectorSource = new VectorSource({
  features: [iconFeature],
});
const vectorLayer = new VectorLayer({
  source: vectorSource,
});

const popupDiv = document.getElementById('popup');
const popupOverlay = new Overlay({
  element: popupDiv,
  positioning: 'bottom-center',
  stopEvent: false,
  offset: [0, -50],
});

const map = new Map({
  target: 'map-container',
  layers: [
    new TileLayer({
      source: new XYZSource({
        url: 'http://tile.stamen.com/terrain/{z}/{x}/{y}.jpg',
      }),
      // source: new OSM(),
    }),
    // Add Point Layer
    vectorLayer,
  ],
  // overlays: [popupOverlay],
  view: new View({
    center: fromLonLat([0, 0]),
    zoom: 2,
  }),
});

map.addOverlay(popupOverlay);

// display popup on click
map.on('click', function (e) {
  const feature = map.forEachFeatureAtPixel(e.pixel, (feature) => feature);
  if (feature) {
    const coordinates = feature.getGeometry().getCoordinates();
    popupOverlay.setPosition(coordinates);
    // bootstrap api: popover, index.html import
    $(popupDiv).popover({
      placement: 'top',
      html: true,
      content: feature.get('name'),
    });
    $(popupDiv).popover('show');
  } else {
    $(popupDiv).popover('destroy');
  }
});

// change mouse cursor when over marker icon
// 성능 이슈 있음
// map.on('pointermove', function (e) {
//   if (e.dragging) {
//     $(popupDiv).popover('destroy');
//     return;
//   }
//   const pixel = map.getEventPixel(e.originalEvent);
//   console.log({ pixel });
//   const hit = map.hasFeatureAtPixel(pixel);
//   document.body.style.cursor = hit ? 'pointer' : '';
// });
