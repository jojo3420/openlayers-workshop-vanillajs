import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat, transformExtent } from 'ol/proj';
import proj4 from 'proj4'; // 의존성 설치!
import { register } from 'ol/proj/proj4';
import { ScaleLine } from 'ol/control';

/*
* ScaleLine Control
  *이 예제는 미국 단위의 ScaleLine 컨트롤을 포함하여 (마일 인듯)
  * OpenStreetMap을 NAD83 Indiana East로
  * 클라이언트 측에서 재 투영하는 것을 보여줍니다.
*
*
https://openlayers.org/en/latest/examples/scaleline-indiana-east.html?q=control
* */

// Projection 선언하기 - projection: 'Indiana-East',
proj4.defs(
  'Indiana-East', // Indiani-East Projection  선언
  'PROJCS["IN83-EF",GEOGCS["LL83",DATUM["NAD83",' +
    'SPHEROID["GRS1980",6378137.000,298.25722210]],PRIMEM["Greenwich",0],' +
    'UNIT["Degree",0.017453292519943295]],PROJECTION["Transverse_Mercator"],' +
    'PARAMETER["false_easting",328083.333],' +
    'PARAMETER["false_northing",820208.333],' +
    'PARAMETER["scale_factor",0.999966666667],' +
    'PARAMETER["central_meridian",-85.66666666666670],' +
    'PARAMETER["latitude_of_origin",37.50000000000000],' +
    'UNIT["Foot_US",0.30480060960122]]',
);
register(proj4); // 등록

function createMap(divId) {
  const view = new View({
    projection: 'Indiana-East',
    zoom: 7,
    minZoom: 6,
    center: fromLonLat([-85.685, 39.891], 'Indiana-East'),
    extent: transformExtent(
      [-172.54, 23.81, -47.74, 86.46],
      'EPSG:4326',
      'Indiana-East',
    ),
  });

  const map = new Map({
    target: divId,
    layers: [
      new TileLayer({
        source: new OSM(),
      }),
    ],
    view,
  });

  // Add ScaleLine!!!
  map.addControl(
    new ScaleLine({
      units: 'us', // 미국 마일(mile) 단위
    }),
  );
  return map;
}

const map1 = createMap('map1');
