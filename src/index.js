import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import XYZSource from 'ol/source/XYZ';
import { fromLonLat } from 'ol/proj';
import { createStringXY } from 'ol/coordinate';
import MousePosition from 'ol/control/MousePosition';
import { defaults as defaultControls } from 'ol/control';

// 마우스 포지션 컨트롤 설정하기
// 1. EPSG:4326: 위도/경도
// 2. EPSG:3857:

// Create mousePositionControl
console.log({ xy: createStringXY(4) });
const mousePositionControl = new MousePosition({
  coordinateFormat: createStringXY(4), // 좌표 형식
  projection: 'EPSG:4326', // View Projection 과 일치 해야 한다.
  //  className 과 target 을 주석처리하면 맵 내부에 렌더링 된다.
  className: 'custom-mouse-position', //  (기본값은 '.ol-mouse-position')
  target: el('#mouse-position'), // 컨트롤을지도의 뷰포트 외부에서 렌더링하려면 대상을 지정하십시오.
  undefinedHTML: '&nbsp;', // 좌표를 사용할 수없는 경우 (예 : 포인터가지도 뷰포트를 떠날 때) 표시되는 마크 업입니다
});

const view = new View({
  center: fromLonLat([0, 0]),
  zoom: 2,
  projection: 'EPSG:4326',
});

const map = new Map({
  target: 'map-container',
  layers: [
    new TileLayer({
      source: new XYZSource({
        url: 'http://tile.stamen.com/terrain/{z}/{x}/{y}.jpg',
      }),
    }),
  ],
  view,
  // 지도 컨트롤러 추가하기
  controls: defaultControls().extend([mousePositionControl]),
});

function el(query) {
  return document.querySelector(query);
}

el('#projection').addEventListener('change', (e) => {
  const projection = e.target.value;
  console.log({ projection });
  mousePositionControl.setProjection(projection);
});

el('#precision').addEventListener('change', (e) => {
  const { valueAsNumber } = e.target;
  console.log({ valueAsNumber });
  const format = createStringXY(valueAsNumber);
  mousePositionControl.setCoordinateFormat(format);
});
const { code_, units_ } = view.getProjection();
// console.log(view.getProjection());
console.log({ code_, units_ });
