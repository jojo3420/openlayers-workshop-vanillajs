import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import { defaults as defaultControls } from 'ol/control';
import { FullScreen } from 'ol/control';

// 마우스 포지션 컨트롤 설정하기

function createMap(divId) {
  const attributons = `
   <a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a>
   <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>
  `;
  const view = new View({
    center: fromLonLat([0, 0]),
    zoom: 2,
    projection: 'EPSG:4326',
  });

  const map = new Map({
    target: divId,
    layers: [
      new TileLayer({
        source: new OSM(),
      }),
    ],
    view,
    // add control
    controls: defaultControls().extend([new FullScreen()]),
    // 출처 표기 버튼
    attributions: attributons,
  });
  console.log({ map });
  return map;
}

const map1 = createMap('map1');
const map2 = createMap('map2');
