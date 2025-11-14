import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, List, Navigation } from 'lucide-react';
import MobileHeader from '../components/mobile/MobileHeader';
import MobileTabBar from '../components/mobile/MobileTabBar';
import { getEvents } from '../api/events';
import {
  loadKakaoMap,
  createMap,
  createMarker,
  createInfoWindow,
  addMarkerEvent,
  moveMapCenter,
} from '../utils/kakaoMap';

export default function MapPage() {
  const navigate = useNavigate();
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);
  const [events, setEvents] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  // 카카오맵 초기화
  useEffect(() => {
    const initMap = async () => {
      try {
        setLoading(true);
        setError(null); // 에러 상태 초기화
        console.log('[MapPage] 지도 초기화 시작');
        console.log('[MapPage] mapContainer.current:', mapContainer.current);

        // DOM 요소가 준비될 때까지 대기
        if (!mapContainer.current) {
          console.error('[MapPage] mapContainer.current가 null입니다');
          setError('지도 컨테이너를 찾을 수 없습니다');
          setLoading(false);
          return;
        }

        // 카카오맵 SDK 로드 대기
        console.log('[MapPage] 카카오맵 SDK 로드 대기 중...');
        await loadKakaoMap();
        console.log('[MapPage] 카카오맵 SDK 로드 완료');

        // 다시 한 번 DOM 요소 확인
        if (!mapContainer.current) {
          console.error('[MapPage] SDK 로드 후에도 mapContainer.current가 null입니다');
          setError('지도 컨테이너를 찾을 수 없습니다');
          setLoading(false);
          return;
        }

        // 지도 생성
        console.log('[MapPage] 지도 생성 중...');
        console.log('[MapPage] 컨테이너:', mapContainer.current);
        console.log('[MapPage] 컨테이너 크기:', {
          width: mapContainer.current.offsetWidth,
          height: mapContainer.current.offsetHeight,
          clientWidth: mapContainer.current.clientWidth,
          clientHeight: mapContainer.current.clientHeight,
        });

        const mapInstance = createMap(mapContainer.current, {
          center: new window.kakao.maps.LatLng(37.5665, 126.9780), // 서울 시청
          level: 8,
        });
        console.log('[MapPage] 지도 생성 완료:', mapInstance);

        setMap(mapInstance);

        // 이벤트 데이터 로드
        console.log('[MapPage] 이벤트 데이터 로드 시작');
        await loadEvents(mapInstance);
        console.log('[MapPage] 이벤트 데이터 로드 완료');

        setLoading(false);
      } catch (err) {
        console.error('[MapPage] 지도 초기화 실패:', err);
        console.error('[MapPage] 에러 상세:', err.message, err.stack);
        setError('지도를 불러오는데 실패했습니다: ' + err.message);
        setLoading(false);
      }
    };

    initMap();
  }, []);

  // 현재 위치 자동 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });

          // 지도가 이미 생성되어 있다면 중심 이동
          if (map) {
            moveMapCenter(map, latitude, longitude, 8);
          }
        },
        (error) => {
          console.log('[MapPage] 위치 권한 거부됨:', error);
          // 에러 시에도 계속 진행 (위치 없이 사용 가능)
        }
      );
    }
  }, [map]);

  // 이벤트 데이터 로드 및 마커 표시
  const loadEvents = async (mapInstance) => {
    try {
      const response = await getEvents({ page_size: 200 });
      const eventsData = response.data.results || response.data;

      // 좌표가 있는 이벤트만 필터링
      const eventsWithCoords = eventsData.filter(
        (event) => event.latitude && event.longitude
      );

      setEvents(eventsWithCoords);

      // 마커 생성
      const newMarkers = eventsWithCoords.map((event) => {
        const marker = createMarker({
          lat: event.latitude,
          lng: event.longitude,
        });

        marker.setMap(mapInstance);

        // 마커 클릭 이벤트
        addMarkerEvent(marker, 'click', () => {
          setSelectedEvent(event);
          moveMapCenter(mapInstance, event.latitude, event.longitude, 5);
        });

        return { marker, event };
      });

      setMarkers(newMarkers);

      // 첫 번째 이벤트 위치로 이동
      if (eventsWithCoords.length > 0) {
        const firstEvent = eventsWithCoords[0];
        moveMapCenter(mapInstance, firstEvent.latitude, firstEvent.longitude, 8);
      }
    } catch (err) {
      console.error('이벤트 데이터 로드 실패:', err);
      setError('이벤트 데이터를 불러오는데 실패했습니다.');
    }
  };

  // 두 지점 사이의 거리 계산 (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // 지구 반지름 (km)
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance;
  };

  // 거리 포맷팅
  const formatDistance = (km) => {
    if (km < 1) {
      return `${Math.round(km * 1000)}m`;
    }
    return `${km.toFixed(1)}km`;
  };

  // 현재 위치 기준으로 이벤트 정렬
  const getSortedEventsByDistance = () => {
    if (!userLocation) return events;

    return [...events].sort((a, b) => {
      const distanceA = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        a.latitude,
        a.longitude
      );
      const distanceB = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        b.latitude,
        b.longitude
      );
      return distanceA - distanceB;
    });
  };

  // 현재 위치로 이동
  const moveToCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('위치 정보를 사용할 수 없습니다.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });

        if (map) {
          moveMapCenter(map, latitude, longitude, 6);
        }
      },
      (error) => {
        console.error('위치 정보 가져오기 실패:', error);
        alert('위치 정보를 가져올 수 없습니다.');
      }
    );
  };

  // 이벤트 카드 클릭 시 지도 이동
  const handleEventClick = (event) => {
    if (map) {
      moveMapCenter(map, event.latitude, event.longitude, 5);
      setSelectedEvent(event);
    }
  };

  // 이벤트 상세 페이지로 이동
  const goToEventDetail = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  return (
    <div className="relative h-screen w-full flex flex-col">
      <MobileHeader showMenu={false} showNotification={false} />

      {/* 지도 컨테이너 - 상단 절반 */}
      <div ref={mapContainer} className="w-full h-1/2 flex-shrink-0" />

      {/* 로딩 오버레이 */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white z-50">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent mb-4"></div>
            <p className="text-gray-600">지도 로딩 중...</p>
          </div>
        </div>
      )}

      {/* 에러 오버레이 */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-white z-50 px-4">
          <div className="text-center">
            <div className="text-4xl mb-4">😢</div>
            <p className="text-lg text-red-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors"
            >
              다시 시도
            </button>
          </div>
        </div>
      )}

      {/* 지도 위 컨트롤 버튼들 */}
      <div className="absolute top-20 right-4 flex flex-col gap-2 z-10">
        {/* 현재 위치 버튼 */}
        <button
          onClick={moveToCurrentLocation}
          className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
          title="현재 위치"
        >
          <Navigation size={24} className="text-pink-500" />
        </button>
      </div>

      {/* 이벤트 개수 표시 */}
      <div className="absolute top-20 left-4 z-10">
        <div className="bg-white px-4 py-2 rounded-full shadow-lg">
          <p className="text-sm font-medium text-gray-700">
            {userLocation ? '근처 ' : ''}
            <span className="text-pink-500 font-bold">{events.length}</span>개의 이벤트
          </p>
        </div>
      </div>

      {/* 하단 이벤트 리스트 */}
      <div className="flex-1 bg-gray-50 overflow-y-auto">
        <div className="p-4 space-y-3">
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-gray-900">
              {userLocation ? '내 주변 축제' : '모든 축제'}
            </h2>
            {!userLocation && (
              <button
                onClick={moveToCurrentLocation}
                className="text-sm text-pink-500 font-medium flex items-center gap-1"
              >
                <Navigation size={16} />
                내 위치에서 찾기
              </button>
            )}
          </div>

          {/* 이벤트 카드 리스트 */}
          {getSortedEventsByDistance().map((event) => {
            const distance = userLocation
              ? calculateDistance(
                  userLocation.lat,
                  userLocation.lng,
                  event.latitude,
                  event.longitude
                )
              : null;

            return (
              <div
                key={event.id}
                onClick={() => handleEventClick(event)}
                className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex">
                  {/* 이미지 */}
                  <div className="w-24 h-24 flex-shrink-0 bg-gradient-to-br from-pink-100 to-pink-200">
                    {event.poster_image && (
                      <img
                        src={event.poster_image}
                        alt={event.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  {/* 정보 */}
                  <div className="flex-1 p-3">
                    <h3 className="font-semibold text-gray-900 line-clamp-1 mb-1 text-sm">
                      {event.name}
                    </h3>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <MapPin size={12} className="text-pink-500 flex-shrink-0" />
                        <span className="truncate">{event.location}</span>
                      </div>
                      {distance !== null && (
                        <div className="flex items-center gap-1 text-xs text-pink-500 font-medium">
                          <Navigation size={12} />
                          <span>{formatDistance(distance)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* 빈 상태 */}
          {events.length === 0 && (
            <div className="text-center py-12">
              <MapPin size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">주변에 이벤트가 없습니다</p>
            </div>
          )}
        </div>
      </div>

      {/* 하단 네비게이션 */}
      <MobileTabBar />
    </div>
  );
}
