import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import TileJSON from 'ol/source/TileJSON';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';

/*
* Layer Zoom Limits
 레이어는 옵션으로 레이어 가시성을 제어하기 위한 minZoom 및 maxZoom 옵션을 지원함
 *
 *
 * 최소 또는 최대 줌을 설정하면 레이어는 minZoom보다 크고
 * maxZoom보다 작거나 같은 줌 레벨에서만 볼 수 있습니다.
 *  map구성 후 레이어의 setMinZoom 및 setMaxZoom을 사용하여 제한을 설정할 수도 있습니다.
 *  이 예는 확대 / 축소 수준 14 이하의 OSM 계층과 확대 / 축소 수준 14 이상의 USGS 계층을 보여줍니다.
*
*
* */
// https://openlayers.org/en/latest/examples/layer-zoom-limits.html?q=control

const divEl = document.getElementById('zoom-level');

function createMap(divId) {
  const view = new View({
    center: fromLonLat([0, 0]),
    zoom: 3,
    maxZoom: 15,
    // projection: 'EPSG:4326',
    constrainOnlyCenter: true,
  });

  const map = new Map({
    target: divId,
    layers: [
      new TileLayer({
        // visible at zoom level 14 and below.
        //  1 ~ 4.9999 사이에 OSM
        maxZoom: 5,
        source: new OSM(),
      }),
      new TileLayer({
        //   // visible at zoom levels above 14
        //   // 즉 5이상 줌 부터 TileJSON layer
        minZoom: 5,
        source: new TileJSON({
          url: 'https://a.tiles.mapbox.com/v3/aj.1x1-degrees.json',
          crossOrigin: 'anonymous',
          tileSize: 512,
        }),
      }),
    ],
    view,
  });

  let currZoom = view.getZoom();
  map.on('moveend', (e) => {
    const newZoom = view.getZoom();
    if (currZoom !== newZoom) {
      divEl.innerHTML = '<h1>zoom:' + newZoom + '</h1>';
      currZoom = newZoom;
    }
  });

  view.origAnimate = view.animate;

  view.animate = function (animateSpecs) {
    if (typeof animateSpecs.resolution !== 'undefined') {
      const currZoom = this.getZoom();
      const newZoom = this.getZoomForResolution(animateSpecs.resolution);
      if (newZoom != currZoom) {
        console.log('zoom start, new zoom: ' + newZoom);
      }
    }
    this.origAnimate(animateSpecs);
  };

  return map;
}

const map1 = createMap('map1');
