import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import { ZoomSlider } from 'ol/control';
import { defaults as defaultControls } from 'ol/control';

// 마우스 포지션 컨트롤 설정하기

function createMap(divId) {
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
    // 하지만 이렇게 해도 된다.
    controls: defaultControls().extend([new ZoomSlider()]),
  });

  // 예제에서는 이렇게 설정한다.
  // const zoomSlider = new ZoomSlider();
  // map.addControl(zoomSlider);
  return map;
}

const map1 = createMap('map1');
const map2 = createMap('map2');
const map3 = createMap('map3');
