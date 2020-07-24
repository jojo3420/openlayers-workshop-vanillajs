import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import OSM from 'ol/source/OSM';
import { fromLonLat, toLonLat } from 'ol/proj';
import { defaults } from 'ol/interaction';
import { Style, Icon } from 'ol/style';
import Point from 'ol/geom/Point';
import Feature from 'ol/Feature';

/**
 * DOM Element
 */
const searchPanel = document.querySelector('#search-panel');
const searchPanelResult = document.querySelector('#search-panel-result');
const searchInput = document.querySelector('#search-input');
const searchBtn = document.querySelector('#search-btn');
const queryHistoryDiv = document.querySelector('#query-history');

/**
 * Constant
 */
const LOCAL_STORAGE_KEY = 'queries'; // localStorage KEY

const map = new Map({
  /**
   * 지도 맵 instance 생성
   */
  target: 'map-container',
  layers: [
    // 배경 레이어 - item index 0
    new TileLayer({
      name: 'OSMLayer',
      source: new OSM(),
    }),
    // 마커 레이어 - item index 1
    new VectorLayer({
      name: 'markerLayer',
      source: new VectorSource({
        features: [],
      }),
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

/**
 * 지도 인스턴스에 뷰포터에  엘리먼트 붙이기
 * 1. search panel element 붙이기
 * 2. seasrchPanelResult
 * 3. queryHistory
 */
map.getViewport().appendChild(searchPanel);
map.getViewport().appendChild(searchPanelResult);
map.getViewport().appendChild(queryHistoryDiv);

function onRemoveQuery(e, query) {
  /**
   * 쿼리 삭제 하기 - onClick
   * 1>로컬 저장소 쿼리 삭제 하기
   * 2> 목록 새로고침
   * */
  e.stopPropagation();
  console.log({ onRemoveQuery: query });
}

function onSelectQuery(query) {
  /**
   *  쿼리 선택 이벤트: 현재 쿼리로 마커 렌더링 하기
   *
   * */
  console.log({ 'onClickQuery:': query });
}

searchInput.addEventListener('focus', (e) => {
  /**
   * 검색어 인풋 focus - show Element
   * */
  console.log('focus');

  // Load queries from localStorage
  const queries = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
  console.log({ queries });
  const ul = queryHistoryDiv.querySelector('ul');
  ul.innerHTML = '';
  queries.map((query) => {
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.textContent = '❌';
    span.style.marginLeft = '150px';
    span.onclick = (e) => onRemoveQuery(e, query);
    li.innerHTML = `${query}`;
    li.append(span);
    li.onclick = () => onSelectQuery(query);
    ul.appendChild(li);
  });

  // Show queries Element
  queryHistoryDiv.style.display = 'block';
});

searchInput.addEventListener('blur', (e) => {
  /**
   *  검색어 인풋 blur
   *
   */
  console.log('blur');

  // hide query history elem ent
  queryHistoryDiv.style.display = 'none';
});

searchBtn.onclick = function () {
  /**
   * 장소 & 주소 검색 클릭 이벤트
   * @type {string}
   */
  const query = searchInput.value;
  console.log({ '장소&주소검색': query });
  // 검색어 검증
  if (!query) return;

  // Request api server
  // query 결과
  const list = [
    {
      id: 1,
      location: '서울역',
      address: '서울 특별시 종로구..',
      coordinates: [20, 12],
    },
    {
      id: 2,
      location: '용산역',
      address: '서울 특별시 용산구..',
      coordinates: [24, 11],
    },
    {
      id: 3,
      location: '강남역',
      address: '서울 특별시 강남구..',
      coordinates: [15, 9],
    },
  ];
  // 조회 목록 조회 및 초기화
  const ul = searchPanelResult.querySelector('ul');
  ul.innerHTML = '';

  // 조회 결과 갯수 html 만들기
  const li = document.createElement('li');
  li.textContent = `장소 ${list.length}`;
  li.style.color = 'red';
  ul.appendChild(li);

  // 조회 목록 html 만들기
  list.map((item) => {
    const li = document.createElement('li');
    li.textContent = item.location;
    li.onclick = function () {
      createPointMarker(item);
    };
    li.style.color = 'green';
    ul.appendChild(li);
  });

  searchPanelResult.appendChild(ul);

  // Show searchPanelResult
  searchPanelResult.style.display = 'block';

  // Save query to localStorage
  let queries = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
  console.log('loading queries', queries);
  if (queries) {
    if (queries.length === 5) {
      // 가장 이전 검색어 삭제
      queries = queries.slice(1, queries.length);
    }
    queries.push(query);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(queries));
  } else {
    console.log('queries is empty.. ==> new query:' + query);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([query]));
  }
  searchInput.value = '';
};

function createPointMarker({ id, location, address, coordinates }) {
  /**
   * 마커 생성 한 후 레이어 에 소스에 마커 추가 하기
   * params:
         * id: 3,
         location: '강남역',
         address: '서울 특별시 강남구..',
         coordinates: [15, 9],
   * @type {string}
   */

  // 보안 할 점: 같은 위치에 feature 추가 된다면? 즉 중복된 마커가 등록 된다면.. 방지 되어야 한다!
  const layer = map.getLayers().item(1);
  const source = layer.getSource();
  const features = source.getFeatures();
  const coords = fromLonLat(coordinates);
  console.log({ coordinates, coords });
  let run = true;
  // 비교 - 현재 coords 와 features 각 feature 의 좌표 비교 하는 도중
  // === 비교가 작동하지 않음
  features.forEach((feature) => {
    console.log({ coords2: feature.getGeometry().coordinates() });
    if (coords === feature.getGeometry().coordinates()) {
      run = false;
    }
  });
  console.log(run ? 'run!!' : 'stop!');
  if (!run) return;

  // point icon url
  const src =
    'data:image/png;base64,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';

  const iconFeature = new Feature({
    geometry: new Point(coords),
    id,
    location,
    address,
  });
  const iconStyle = new Style({
    image: new Icon({
      anchor: [0.5, 46],
      anchorXUnits: 'fraction',
      anchorYUnits: 'pixels',
      src: src,
      // size: pixel 단위
      size: [100, 200],
      // sale: 0.5,
    }),
  });

  iconFeature.setStyle(iconStyle);
  console.log({ features });

  // 기존 마커 소스에 신규 마커 추가!
  const newSource = new VectorSource({
    features: [...features, iconFeature],
  });
  layer.setSource(newSource);
}
