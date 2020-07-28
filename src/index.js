import 'ol/ol.css';
import 'ol-layerswitcher/src/ol-layerswitcher.css';
import { Map, View } from 'ol';
import OSMSource from 'ol/source/OSM';
import LayerGroup from 'ol/layer/Group';
import TileLayer from 'ol/layer/Tile';
import StamenSource from 'ol/source/Stamen';
import ImageArcGisRestSource from 'ol/source/ImageArcGISRest';
import ImageLayer from 'ol/layer/Image';
import { transform } from 'ol/proj';
import LayerSwitcher from 'ol-layerswitcher';

// github - sample code
// https://github.com/walkermatt/ol-layerswitcher-examples

// npm
// https://www.npmjs.com/package/ol-layerswitcher

/**
 * LayerSwitcher Library study -1
 * 기본 사용법
 */

const overlayGroup = new LayerGroup({
  title: 'Overlays',
  layers: [],
});

const baseLayerGroup = new LayerGroup({
  title: 'Base Maps',
  layers: [
    // 선택된 레이어는 가장 나중에 등록된 레이어가 선택됨!
    new TileLayer({
      title: 'waterColor',
      type: 'base',
      source: new StamenSource({
        layer: 'watercolor',
      }),
    }),
    new TileLayer({
      title: 'OSM',
      type: 'base',
      source: new OSMSource(),
    }),
  ],
});

const map = new Map({
  target: 'map',
  layers: [baseLayerGroup, overlayGroup],
  view: new View({
    center: [0, 0],
    zoom: 3,
  }),
});

// add LayerSwitcher
const layerSwitcher = new LayerSwitcher();
map.addControl(layerSwitcher);

// Create Label
const terrainLabels1 = new TileLayer({
  title: 'terrain-labels1',
  source: new StamenSource({
    layer: 'terrain-labels',
  }),
});

// Push layer to layerGroup
overlayGroup.getLayers().push(terrainLabels1);
