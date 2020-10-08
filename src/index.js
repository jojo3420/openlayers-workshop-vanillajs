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
import markerIcon from './marker_A.png';
import { createStringXY } from 'ol/coordinate';
import { defaults as defaultControls, MousePosition } from 'ol/control';
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';
import TileWMS from 'ol/source/TileWMS';
import ImageLayer from 'ol/layer/Image';
import ImageWMS from 'ol/source/ImageWMS';
import LayerGroup from 'ol/layer/Group';
// import $ from 'jquery';
// import 'bootstrap';

let center4326 = [126.8018, 37.3809]; // EPSG:4326
let center3857 = [14115545.2862, 4492695.4896]; //  EPSG:3857
let center5179 = [938303.3669, 1931995.8442]; //  EPSG:5179
// marker

// https://epsg.io/?format=json&q=5179
const EPSG_5179 = 'EPSG:5179'; // naver 좌표계
// naver에서 사용하는 한국 좌표계
const EPSG_5179_DEFS =
  '+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs';

proj4.defs(EPSG_5179, EPSG_5179_DEFS);
register(proj4);

const iconFeature = new Feature({
  // geometry: new Point(fromLonLat(center)),
  // geometry: new Point(center4326),
  // geometry: new Point(center3857),
  geometry: new Point(center5179),

  name: '시흥시 어느곳',
  population: 4000,
  rainfall: 500,
});
const iconStyle = new Style({
  image: new Icon({
    anchor: [0.5, 46],
    anchorXUnits: 'fraction',
    anchorYUnits: 'pixels',
    src: markerIcon,
    // size: pixel 단위
    // size: toSize([100, 200]) || [100, 400],
    // sale: 0.5,
  }),
});
iconFeature.setStyle(iconStyle);

// Create marker layer
const vectorSource = new VectorSource({
  features: [iconFeature],
});
const markerLayer = new VectorLayer({
  source: vectorSource,
});

// popup element
const popupDiv = document.getElementById('popup');
const popupOverlay = new Overlay({
  element: popupDiv,
  positioning: 'bottom-center',
  stopEvent: false,
  offset: [0, -50],
});

// create mouse-position
const mousePositionControl = new MousePosition({
  coordinateFormat: createStringXY(4),
  // projection: 'EPSG:4326',
  // projection: 'EPSG:3857',
  projection: 'EPSG:5179',
  className: 'custom-mouse-position',
  target: document.getElementById('mouse-position'),
  undefinedHTML: '&nbsp;',
});

const imageLayer = new ImageLayer({
  source: new ImageWMS({
    ratio: 1,
    url:
      'http://dev-igeoserver-v2.qp65kfdyam.ap-northeast-2.elasticbeanstalk.com:80/SIHEUNG-SI_BASE/wms',
    params: {
      FORMAT: 'image/png',
      VERSION: '1.1.1',
      LAYERS: 'SIHEUNG-SI_BASE:LG_SIHEUNG-SI_LIGHT',
      exceptions: 'application/vnd.ogc.se_inimage',
    },
  }),
});
const tiledLayer = new TileLayer({
  visible: true,
  source: new TileWMS({
    url:
      'http://dev-igeoserver-v2.qp65kfdyam.ap-northeast-2.elasticbeanstalk.com:80/SIHEUNG-SI_BASE/wms',
    params: {
      FORMAT: 'image/png',
      VERSION: '1.1.1',
      tiled: true,
      LAYERS: 'SIHEUNG-SI_BASE:LG_SIHEUNG-SI_LIGHT',
      exceptions: 'application/vnd.ogc.se_inimage',
      tilesOrigin: 921510.5134551331 + ',' + 1923543.028626753,
    },
  }),
});
const mainLayerGroup = new LayerGroup({
  title: '시흥시 레이어',
  type: 'base',
  combine: true,
  visible: true,
  layers: [imageLayer, tiledLayer],
});

// const baseLayerGroup = new LayerGroup({
//   title: 'Base Map',
//   // layerGroup 도 레이어로 추가 가능!
//   layers: [
//     mainLayerGroup,
//     // osmLayer,
//     // waterColorLayer,
//     // waterColorLayerGroup,
//   ],
// });

const view = new View({
  // projection: 'EPSG:3857',
  // center: center3857,
  zoom: 14,
  // center: center4326,
  // projection: 'EPSG:4326',
  center: center5179,
  projection: 'EPSG:5179',
});

const map = new Map({
  target: 'map-container',
  layers: [
    mainLayerGroup,
    // new TileLayer({
    //   source: new OSM(),
    // }),
    // Add Point Layer
    markerLayer,
  ],
  overlays: [popupOverlay],
  view: view,
  controls: defaultControls().extend([mousePositionControl]),
});

console.log({ view });

// projection select event
const projectionSelect = document.getElementById('projection');
projectionSelect.addEventListener('change', (e) => {
  const projection = e.target.value;
  console.log({ projection });
  mousePositionControl.setProjection(projection);
});

// precisionInput event
const precisionInput = document.getElementById('precision');
precisionInput.addEventListener('change', (e) => {
  const format = createStringXY(e.target.valueAsNumber);
  mousePositionControl.setCoordinateFormat(format);
});

// display popup on click
map.on('click', function (e) {
  // console.log('click');
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
