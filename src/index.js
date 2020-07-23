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
const searchPanelResult = document.querySelector('#search-panel-result');
const searchInput = document.querySelector('#search-input');
const searchBtn = document.querySelector('#search-btn');
// const panelCnt = document.querySelector('#panel-cnt');
// const panelHistory = document.querySelector('#panel-history');

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

// searchInput.addEventListener('focus', function (e) {
//   console.log('focus');
//   // load query history by localStorage
//   const queryHistory = JSON.parse(localStorage.getItem('queryHistory'));
//   console.log({ queryHistory });
// });

// 장소 /주소 검색
searchBtn.onclick = function () {
  const query = searchInput.value;
  console.log({ '장소&주소검색': query });
  if (!query) return;

  // save query to localHistory
  const queryHistory = JSON.parse(localStorage.getItem('queryHistory'));
  if (queryHistory) {
    queryHistory.push(query);
    localStorage.setItem('queryHistory', JSON.stringify(queryHistory));
  } else {
    localStorage.setItem('queryHistory', JSON.stringify([query]));
  }

  // query 결과
  const list = [
    { id: 1, location: '서울역', address: '서울 특별시 종로구..' },
    { id: 2, location: '용산역', address: '서울 특별시 용산구..' },
    { id: 3, location: '강남역', address: '서울 특별시 강남구..' },
  ];
  console.log({ searchPanel });

  // 조회 결과 갯수
  // const cntEl = searchPanelResult.querySelector('div');
  // cntEl.innerHTML = '';
  // cntEl.innerHTML = `장소 <span>${list.length}</span>`;

  // 조회 목록
  const ul = searchPanelResult.querySelector('ul');
  ul.innerHTML = '';

  // 목록 결과 갯수 html 만들기
  const li = document.createElement('li');
  li.textContent = `장소 ${list.length}`;
  ul.appendChild(li);
  li.onclick = function () {};

  // 조회 목록 html 만들기
  list.map((item) => {
    const li = document.createElement('li');
    li.textContent = item.location;
    li.onclick = function () {};
    ul.appendChild(li);
  });

  searchPanelResult.appendChild(ul);

  // Show searchPanelResult
  searchPanelResult.style.display = 'block';

  searchInput.value = '';
};

// panel element 붙이기
map.getViewport().appendChild(searchPanel);
map.getViewport().appendChild(searchPanelResult);
