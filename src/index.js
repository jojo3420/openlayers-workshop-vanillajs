import 'ol/ol.css'; // this is ol default style
import 'ol-layerswitcher/src/ol-layerswitcher.css';

import Map from 'ol/Map';
import View from 'ol/View';
import { transform } from 'ol/proj';
import LayerGroup from 'ol/layer/Group';
import LayerSwitcher from 'ol-layerswitcher';
import TileLayer from 'ol/layer/Tile';
import StamenSource from 'ol/source/Stamen';
import OSM from 'ol/source/OSM';
import ImageLayer from 'ol/layer/Image';
import ImageArcGISRest from 'ol/source/ImageArcGISRest';

/**
 *  sidebar 예제
 *
 */

const baseLayerGroup = new LayerGroup({
  title: 'Base Maps',
  layers: [
    new LayerGroup({
      title: 'Water color with labels',
      type: 'base',
      combine: true,
      visible: false,
      layers: [
        new TileLayer({
          source: new StamenSource({
            layer: 'watercolor',
          }),
        }),
        new TileLayer({
          source: new StamenSource({
            layer: 'terrain-labels',
          }),
        }),
      ],
    }),
    new TileLayer({
      title: 'Water color',
      type: 'base',
      visible: false,
      source: new StamenSource({
        layer: 'watercolor',
      }),
    }),
    new TileLayer({
      title: 'OSM',
      type: 'base',
      visible: true,
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
    new LayerGroup({
      // A layer must have a title to appear in the layerswitcher
      title: 'Census',
      fold: 'open',
      layers: [
        new ImageLayer({
          title: 'Districts',
          source: new ImageArcGISRest({
            ratio: 1,
            params: { LAYERS: 'show:0' },
            url:
              'https://ons-inspire.esriuk.com/arcgis/rest/services/Census_Boundaries/Census_Merged_Local_Authority_Districts_December_2011_Boundaries/MapServer',
          }),
        }),
        new ImageLayer({
          title: 'Wards',
          visible: false,
          source: new ImageArcGISRest({
            ratio: 1,
            params: { LAYERS: 'show:0' },
            url:
              'https://ons-inspire.esriuk.com/arcgis/rest/services/Census_Boundaries/Census_Merged_Wards_December_2011_Boundaries/MapServer',
          }),
        }),
      ],
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

// const layerSwitcher = new LayerSwitcher();
// map.addControl(layerSwitcher);

// Get out-of-the-map div element with the ID "layers" and renders layers to it.
// NOTE: If the layers are changed outside of the layer switcher then you
// will need to call ol.control.LayerSwitcher.renderPanel again to refesh
// the layer tree. Style the tree via CSS.

// position option: left or right
const sidebar = new ol.control.Sidebar({
  element: 'sidebar',
  position: 'right',
});

const toc = document.getElementById('layers');
ol.control.LayerSwitcher.renderPanel(map, toc);
map.addControl(sidebar);
