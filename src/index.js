import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat, toLonLat } from 'ol/proj';
import { defaults } from 'ol/interaction';

/**
 * Elements that make up the popup.
 */
const searchPanel = document.querySelector('#search-panel');
const searchInput = document.querySelector('#search-input');
const searchBtn = document.querySelector('#search-btn');

const map = new Map({
  target: 'map-container',
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
  ],
  overlays: [],
  // doubleClick 방지
  interactions: defaults({ doubleClickZoom: false }),

  view: new View({
    center: fromLonLat([0, 0]),
    zoom: 2,
  }),
});

// 장소 /주소 검색
searchBtn.onclick = function () {
  const query = searchInput.value;
  console.log({ query });
  searchInput.value = '';
};

// panel element 붙이기
map.getViewport().appendChild(searchPanel);
