import 'ol/ol.css';
import 'ol-layerswitcher/src/ol-layerswitcher.css';

import Map from 'ol/Map';
import View from 'ol/View';
import { transform } from 'ol/proj';
import LayerGroup from 'ol/layer/Group';
import LayerImage from 'ol/layer/Image';
import LayerTile from 'ol/layer/Tile';
import SourceImageArcGISRest from 'ol/source/ImageArcGISRest';
import SourceOSM from 'ol/source/OSM';
import SourceStamen from 'ol/source/Stamen';
import LayerSwitcher from 'ol-layerswitcher';
import TileLayer from 'ol/layer/Tile';
import StamenSource from 'ol/source/Stamen';

//  base layer 는 type 프로퍼티의 'base' 값 필수!
//  라디오 버튼 옵션으로 베이스 레이어들 중에 1개만 선택 되도록 구성됨
const osmLayer = new LayerTile({
  title: 'OSM',
  type: 'base',
  visible: true,
  source: new SourceOSM(),
});

const waterColorLayer = new LayerTile({
  title: 'Water color',
  type: 'base',
  visible: false,
  source: new SourceStamen({
    layer: 'watercolor',
  }),
});

// 2개의 layer 로 구성된  레이어 그룹
// 레이어 그룹도 1개의 레이어 처럼 작동함. 단지 레이어가 2개로 구성되어 있음!
const waterColorLayerGroup = new LayerGroup({
  title: 'Water color with labels',
  type: 'base',
  combine: true,
  visible: false,
  layers: [
    // map layer
    new LayerTile({
      source: new SourceStamen({
        layer: 'watercolor',
      }),
    }),
    // label layer
    new LayerTile({
      source: new SourceStamen({
        layer: 'terrain-labels',
      }),
    }),
  ],
});

const baseLayerGroup = new LayerGroup({
  title: 'Base maps',
  // 순서는 가장 나중에 등록되어 있는ㄴ 레이어가 활성화 되며
  // 디스플레이 순서는 osm, waterColor, watercolor with Label
  layers: [waterColorLayerGroup, waterColorLayer, osmLayer],
});

// type: 이 base 속성이 빠지면 옵션 레이어가 되며
// 여러개 선택 또는 1개 선택 가능 하도록 체크 박스로 표현됨!
const overlayGroup = new LayerGroup({
  title: 'Overlays',
  layers: [
    new LayerImage({
      title: 'Countries',
      source: new SourceImageArcGISRest({
        ratio: 1,
        params: { LAYERS: 'show:0' },
        // 요청후 응답까지 몇초 걸림..
        url:
          'https://ons-inspire.esriuk.com/arcgis/rest/services/Administrative_Boundaries/Countries_December_2016_Boundaries/MapServer',
      }),
    }),
    // Create Label
    new TileLayer({
      title: 'terrain-labels1',
      source: new StamenSource({
        layer: 'terrain-labels',
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
