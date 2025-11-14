/**
 * 카카오맵 유틸리티 함수
 */

const KAKAO_MAP_APP_KEY = '07613b74128ff7b75d0ee96cfd98b6e5';

// 카카오맵 SDK가 로드되었는지 확인
export const isKakaoMapLoaded = () => {
  return (
    typeof window !== 'undefined' &&
    window.kakao &&
    window.kakao.maps &&
    typeof window.kakao.maps.LatLng === 'function'
  );
};

// 카카오맵 SDK 스크립트를 동적으로 로드
const loadKakaoMapScript = () => {
  return new Promise((resolve, reject) => {
    console.log('[loadKakaoMapScript] 스크립트 동적 로드 시작');

    // 이미 완전히 로드되었는지 확인
    if (isKakaoMapLoaded()) {
      console.log('[loadKakaoMapScript] 이미 완전히 로드됨');
      resolve();
      return;
    }

    // kakao 객체는 있지만 maps가 아직 준비되지 않은 경우
    if (window.kakao && window.kakao.maps && !window.kakao.maps.LatLng) {
      console.log('[loadKakaoMapScript] kakao.maps.load() 호출 대기 중');
      window.kakao.maps.load(() => {
        console.log('[loadKakaoMapScript] kakao.maps.load 완료');
        resolve();
      });
      return;
    }

    // 이미 스크립트가 있는지 확인
    const existingScript = document.querySelector(
      'script[src*="dapi.kakao.com"]'
    );
    if (existingScript) {
      console.log('[loadKakaoMapScript] 스크립트 태그 이미 존재, 로드 대기 중');
      // 스크립트는 있지만 아직 로드되지 않은 경우, 로드 완료 대기
      const checkLoaded = () => {
        if (window.kakao && window.kakao.maps) {
          window.kakao.maps.load(() => {
            console.log('[loadKakaoMapScript] 기존 스크립트 로드 완료');
            resolve();
          });
        } else {
          setTimeout(checkLoaded, 100);
        }
      };
      checkLoaded();
      return;
    }

    // 새 스크립트 태그 생성
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_APP_KEY}&libraries=services,clusterer&autoload=false`;

    script.onload = () => {
      console.log('[loadKakaoMapScript] 스크립트 로드 완료');
      // autoload=false이므로 수동으로 로드
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          console.log('[loadKakaoMapScript] kakao.maps.load 완료');
          resolve();
        });
      } else {
        reject(new Error('kakao 객체를 찾을 수 없습니다'));
      }
    };

    script.onerror = () => {
      console.error('[loadKakaoMapScript] 스크립트 로드 실패');
      reject(new Error('카카오맵 SDK 스크립트 로드 실패'));
    };

    console.log('[loadKakaoMapScript] 스크립트 태그 추가:', script.src);
    document.head.appendChild(script);
  });
};

// 카카오맵 SDK 로드 대기
export const loadKakaoMap = async () => {
  console.log('[loadKakaoMap] 시작');
  console.log('[loadKakaoMap] window.kakao:', window.kakao);

  if (isKakaoMapLoaded()) {
    console.log('[loadKakaoMap] 이미 로드됨');
    return window.kakao;
  }

  try {
    console.log('[loadKakaoMap] 스크립트 로드 시작');
    await loadKakaoMapScript();
    console.log('[loadKakaoMap] 로드 완료, window.kakao:', window.kakao);
    return window.kakao;
  } catch (error) {
    console.error('[loadKakaoMap] 로드 실패:', error);
    throw error;
  }
};

// 지도 생성
export const createMap = (container, options = {}) => {
  if (!isKakaoMapLoaded()) {
    throw new Error('카카오맵 SDK가 로드되지 않았습니다');
  }

  const defaultOptions = {
    center: new window.kakao.maps.LatLng(37.5665, 126.9780), // 서울 시청
    level: 8, // 확대 레벨
  };

  const mapOptions = { ...defaultOptions, ...options };
  return new window.kakao.maps.Map(container, mapOptions);
};

// 마커 생성
export const createMarker = (position, options = {}) => {
  if (!isKakaoMapLoaded()) {
    throw new Error('카카오맵 SDK가 로드되지 않았습니다');
  }

  const markerPosition = new window.kakao.maps.LatLng(position.lat, position.lng);
  const markerOptions = {
    position: markerPosition,
    ...options,
  };

  return new window.kakao.maps.Marker(markerOptions);
};

// 인포윈도우 생성
export const createInfoWindow = (content, options = {}) => {
  if (!isKakaoMapLoaded()) {
    throw new Error('카카오맵 SDK가 로드되지 않았습니다');
  }

  const infoWindowOptions = {
    content,
    removable: true,
    ...options,
  };

  return new window.kakao.maps.InfoWindow(infoWindowOptions);
};

// 마커 클러스터러 생성 (선택사항)
export const createMarkerClusterer = (map, markers = [], options = {}) => {
  if (!isKakaoMapLoaded()) {
    throw new Error('카카오맵 SDK가 로드되지 않았습니다');
  }

  // 마커 클러스터러는 별도 라이브러리 필요
  if (!window.kakao.maps.MarkerClusterer) {
    console.warn('마커 클러스터러 라이브러리가 로드되지 않았습니다');
    return null;
  }

  return new window.kakao.maps.MarkerClusterer({
    map,
    markers,
    ...options,
  });
};

// 지도 중심 이동
export const moveMapCenter = (map, lat, lng, level) => {
  if (!map) return;

  const moveLatLon = new window.kakao.maps.LatLng(lat, lng);
  map.setCenter(moveLatLon);

  if (level) {
    map.setLevel(level);
  }
};

// 마커에 이벤트 리스너 추가
export const addMarkerEvent = (marker, eventType, handler) => {
  if (!marker) return;
  window.kakao.maps.event.addListener(marker, eventType, handler);
};

// 주소 -> 좌표 변환 (Geocoding)
export const addressToCoords = (address) => {
  return new Promise((resolve, reject) => {
    if (!isKakaoMapLoaded()) {
      reject(new Error('카카오맵 SDK가 로드되지 않았습니다'));
      return;
    }

    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.addressSearch(address, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        resolve({
          lat: parseFloat(result[0].y),
          lng: parseFloat(result[0].x),
        });
      } else {
        reject(new Error('주소 변환 실패'));
      }
    });
  });
};

// 이벤트용 커스텀 마커 이미지 생성
export const createCustomMarkerImage = (imageSrc, size = { width: 40, height: 45 }) => {
  if (!isKakaoMapLoaded()) {
    throw new Error('카카오맵 SDK가 로드되지 않았습니다');
  }

  const imageSize = new window.kakao.maps.Size(size.width, size.height);
  return new window.kakao.maps.MarkerImage(imageSrc, imageSize);
};
