import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import OSM from 'ol/source/OSM';
import {
  MousePosition,
  ZoomToExtent,
  defaults as defaultControls,
} from 'ol/control';
import { createStringXY } from 'ol/coordinate';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Icon, Style } from 'ol/style';
import { toSize } from 'ol/size';
import Overlay from 'ol/Overlay';
import { fromLonLat } from 'ol/proj';
import iconURL from './data/icon.png';
import buttonIcon from './data/button.png';

/*
 * ZoomToExtent
 * 이 기능을 이용하여 초기 위치로 화면을 이동하는 기능 구현!
  https://openlayers.org/en/latest/examples/navigation-controls.html?q=control
  *
 * */

const center = [126.98, 37.57];

function createMap(divId) {
  const view = new View({
    zoom: 13,
    center: center,
    // center: [0, 0],
    projection: 'EPSG:4326',
  });

  const mousePosition = new MousePosition({
    projection: 'EPSG:4326',
    //  정밀도 6자릿
    coordinateFormat: createStringXY(6),
  });
  const zoomToExtent = new ZoomToExtent({
    // f1, f2
    extent: [
      126.955912,
      37.577676,
      127.005598,
      37.559109,
      126.956392,
      37.555499,
      127.005598,
      37.559109,
    ],
    label: 'G',
    // tipLabel: 'TIP',
    // className: 'custom-zoom-extent',
    // target: document.querySelector('#position-button'),
  });

  const f1 = createFeature([126.955912, 37.577676]);
  const f2 = createFeature([127.002621, 37.580178]);
  const f3 = createFeature([126.956392, 37.555499]);
  const f4 = createFeature([127.005598, 37.559109]);
  const centerPoint = createFeature(center);

  const map = new Map({
    target: divId,
    layers: [
      new TileLayer({
        source: new OSM(),
      }),
      new VectorLayer({
        source: new VectorSource({
          features: [f1, f2, f3, f4, centerPoint],
        }),
      }),
    ],
    view,
    controls: defaultControls().extend([mousePosition, zoomToExtent]),
  });

  return map;
}

function createFeature(coords) {
  if (!coords) return;

  console.log({ coords });
  const feature = new Feature({
    geometry: new Point(coords),
    name: 'test-name',
  });
  const iconStyle = new Style({
    image: new Icon({
      anchor: [0.5, 46],
      anchorXUnits: 'fraction',
      anchorYUnits: 'pixels',
      src: coords.toString() === center.toString() ? buttonIcon : iconURL,
    }),
  });
  feature.setStyle(iconStyle);

  return feature;
}

const map = createMap('map');
const btn = document.querySelector('#btn');
btn.onclick = (e) => {
  const view = map.getView();
  // const extent =
  //   [
  //     126.955912,
  //     37.577676,
  //     127.005598,
  //     37.559109,
  //     126.956392,
  //     37.555499,
  //     127.005598,
  //     37.559109,
  //   ] || view.getProjection().getExtent();
  // console.log({ extent });
  // view.fit(extent);
  const zoom = view.getZoom();
  view.setCenter(center);
  if (zoom !== 13) {
    view.setZoom(13); // map default zoom is 13
  }
};
