import 'ol/ol.css';
import 'ol-layerswitcher/src/ol-layerswitcher.css';

import Map from 'ol/Map';
import View from 'ol/View';
import { transform } from 'ol/proj';
import LayerGroup from 'ol/layer/Group';
import LayerSwitcher from 'ol-layerswitcher';
import TileLayer from 'ol/layer/Tile';
import StamenSource from 'ol/source/Stamen';
import { ATTRIBUTION } from 'ol/source/OSM';
import OSM from 'ol/source/OSM';
import ImageLayer from 'ol/layer/Image';
import ImageArcGISRest from 'ol/source/ImageArcGISRest';

/**
 * 스크롤 예제
 *
 *  CSS style max-height를 지정 하면 레이어 패널의 길이를 고정 시킬 수 있다.
    지정 하지 않으면 layerSiwtcher 패널이 레이어 만큼 늘어 난다.
 */

const thunderforestAttributions = [
  'Tiles &copy; <a href="http://www.thunderforest.com/">Thunderforest</a>',
  ATTRIBUTION,
];

const baseLayerGroup = new LayerGroup({
  title: 'Base Maps',
  layers: [
    new TileLayer({
      title: 'Stamen - Water color',
      type: 'base',
      visible: true, // 디폴드로 보이는 레이어 지정!
      source: new StamenSource({
        layer: 'watercolor',
      }),
    }),
    new TileLayer({
      title: 'Stamen - Toner',
      type: 'base',
      visible: false,
      source: new StamenSource({
        layer: 'toner',
      }),
    }),
    new TileLayer({
      title: 'Thunderforest - OpenCycleMap',
      type: 'base',
      visible: false,
      source: new OSM({
        url: 'http://{a-c}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png',
        attributions: thunderforestAttributions,
      }),
    }),
    new TileLayer({
      title: 'Thunderforest - Outdoors',
      type: 'base',
      visible: false,
      source: new OSM({
        url: 'http://{a-c}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png',
        attributions: thunderforestAttributions,
      }),
    }),
    new TileLayer({
      title: 'Thunderforest - Landscape',
      type: 'base',
      visible: false,
      source: new OSM({
        url: 'http://{a-c}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png',
        attributions: thunderforestAttributions,
      }),
    }),
    new TileLayer({
      title: 'Thunderforest - Transport',
      type: 'base',
      visible: false,
      source: new OSM({
        url: 'http://{a-c}.tile.thunderforest.com/transport/{z}/{x}/{y}.png',
        attributions: thunderforestAttributions,
      }),
    }),
    new TileLayer({
      title: 'Thunderforest - Transport Dark',
      type: 'base',
      visible: false,
      source: new OSM({
        url:
          'http://{a-c}.tile.thunderforest.com/transport-dark/{z}/{x}/{y}.png',
        attributions: thunderforestAttributions,
      }),
    }),
    new TileLayer({
      title: 'OSM',
      type: 'base',
      visible: false,
      source: new OSM(),
    }),
  ],
});

const overlayGroup = new LayerGroup({
  title: 'Overlays',
  layers: [
    new ImageLayer({
      title: 'Countries',
      visible: false,
      source: new ImageArcGISRest({
        ratio: 1,
        params: { LAYERS: 'show:0' },
        url:
          'https://ons-inspire.esriuk.com/arcgis/rest/services/Administrative_Boundaries/Countries_December_2016_Boundaries/MapServer',
      }),
    }),
  ],
});

const map = new Map({
  target: 'map',
  // baseLayer 가 나중에 보이도록 순서를 나중에 해야 base layer 에게
  // 가리질 않는다. 이거는 문서로 확인 필요.
  layers: [baseLayerGroup, overlayGroup],
  view: new View({
    center: transform([-0.92, 52.96], 'EPSG:4326', 'EPSG:3857'),
    zoom: 6,
  }),
});

const layerSwitcher = new LayerSwitcher();
map.addControl(layerSwitcher);
