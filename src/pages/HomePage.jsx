import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, ChevronRight } from 'lucide-react';
import { getEvents } from '../api/events';

export default function HomePage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewAll, setViewAll] = useState(null); // 'festival', 'concert', 'exhibition', 'popup' or null

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await getEvents({ page_size: 200 });
      setEvents(response.data.results || response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 카테고리별 필터링
  const festivalEvents = events.filter((e) => e.category === 'festival');
  const concertEvents = events.filter((e) => e.category === 'concert');
  const exhibitionEvents = events.filter((e) => e.category === 'exhibition');
  const popupEvents = events.filter((e) => e.category === 'popup');

  // 배너용 이벤트 (상위 3개)
  const bannerEvents = events.slice(0, 3);

  // 카테고리 아이콘
  const categories = [
    { id: 'all', icon: '🎪', label: '전체', filter: null },
    { id: 'festival', icon: '🎉', label: '축제', filter: 'festival' },
    { id: 'concert', icon: '🎵', label: '공연', filter: 'concert' },
    { id: 'exhibition', icon: '🎨', label: '전시', filter: 'exhibition' },
    { id: 'popup', icon: '🛍️', label: '팝업', filter: 'popup' },
  ];

  // 배너 자동 슬라이드
  useEffect(() => {
    if (bannerEvents.length === 0) return;
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % bannerEvents.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [bannerEvents.length]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 상단 헤더 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/images/logo.svg"
              alt="Festago Logo"
              className="h-8 w-8"
            />
            <img
              src="/images/FESTAGO.svg"
              alt="FESTAGO"
              className="h-6"
            />
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/search')} className="p-2">
              <Search size={24} className="text-gray-700" />
            </button>
            <button onClick={() => navigate('/profile')} className="p-2">
              <User size={24} className="text-gray-700" />
            </button>
          </div>
        </div>
      </header>

      {/* 안내 메시지 */}
      <div className="px-4 py-2 bg-pink-50">
        <p className="text-sm text-pink-600">
          ✨ 서울 및 경기도 다양한 축제 및 행사 정보를 만나보세요!
        </p>
      </div>

      {/* 배너 캐러셀 */}
      {bannerEvents.length > 0 && (
        <div className="relative px-4 py-4">
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-lg">
            {bannerEvents.map((event, index) => (
              <div
                key={event.id}
                onClick={() => navigate(`/events/${event.id}`)}
                className={`absolute inset-0 transition-opacity duration-500 cursor-pointer ${
                  index === currentBanner ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img
                  src={event.poster_image}
                  alt={event.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="text-xl font-bold mb-1">{event.name}</h3>
                  <p className="text-sm opacity-90">📍 {event.location}</p>
                </div>
              </div>
            ))}

            {/* 인디케이터 */}
            <div className="absolute bottom-4 right-4 flex gap-1">
              {bannerEvents.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentBanner
                      ? 'bg-white w-6'
                      : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 카테고리 버튼 */}
      <div className="px-4 py-6 mt-2">
        <div className="flex gap-4 justify-center pb-2">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className="flex flex-col items-center gap-1 cursor-pointer"
            >
              <div className={`w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center text-2xl hover:shadow-lg transition-all ${
                selectedCategory === cat.id ? 'ring-2 ring-pink-500 bg-pink-50' : ''
              }`}>
                {cat.icon}
              </div>
              <span className={`text-xs font-medium ${
                selectedCategory === cat.id ? 'text-pink-500' : 'text-gray-700'
              }`}>
                {cat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 축제 BEST */}
      {(selectedCategory === 'all' || selectedCategory === 'festival') && (
        <section className="py-4">
          <div className="px-4 mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">축제 BEST</h2>
            <button
              onClick={() => navigate('/events?category=festival')}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-pink-500 transition-colors"
            >
              더보기
              <ChevronRight size={16} />
            </button>
          </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar px-4">
          {festivalEvents.slice(0, 6).map((event) => (
            <Link
              key={event.id}
              to={`/events/${event.id}`}
              className="flex-shrink-0 w-40"
            >
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-md mb-2">
                <img
                  src={event.poster_image}
                  alt={event.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-1 bg-pink-500 text-white text-xs font-medium rounded-full">
                    축제
                  </span>
                </div>
              </div>
              <h3 className="text-sm font-bold text-gray-900 line-clamp-2 mb-1">
                {event.name}
              </h3>
              <p className="text-xs text-gray-500">{event.location}</p>
            </Link>
          ))}
        </div>
        </section>
      )}

      {/* 공연 BEST */}
      {(selectedCategory === 'all' || selectedCategory === 'concert') && (
        <section className="py-4">
        <div className="px-4 mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">공연 BEST</h2>
          <button
            onClick={() => navigate('/events?category=concert')}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-pink-500 transition-colors"
          >
            더보기
            <ChevronRight size={16} />
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar px-4">
          {concertEvents.slice(0, 6).map((event) => (
            <Link
              key={event.id}
              to={`/events/${event.id}`}
              className="flex-shrink-0 w-40"
            >
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-md mb-2">
                <img
                  src={event.poster_image}
                  alt={event.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-1 bg-purple-500 text-white text-xs font-medium rounded-full">
                    공연
                  </span>
                </div>
              </div>
              <h3 className="text-sm font-bold text-gray-900 line-clamp-2 mb-1">
                {event.name}
              </h3>
              <p className="text-xs text-gray-500">{event.location}</p>
            </Link>
          ))}
        </div>
        </section>
      )}

      {/* 전시 BEST */}
      {(selectedCategory === 'all' || selectedCategory === 'exhibition') && (
        <section className="py-4">
          <div className="px-4 mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">전시 BEST</h2>
            <button
              onClick={() => navigate('/events?category=exhibition')}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-pink-500 transition-colors"
            >
              더보기
              <ChevronRight size={16} />
            </button>
          </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar px-4">
          {exhibitionEvents.slice(0, 6).map((event) => (
            <Link
              key={event.id}
              to={`/events/${event.id}`}
              className="flex-shrink-0 w-40"
            >
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-md mb-2">
                <img
                  src={event.poster_image}
                  alt={event.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">
                    전시
                  </span>
                </div>
              </div>
              <h3 className="text-sm font-bold text-gray-900 line-clamp-2 mb-1">
                {event.name}
              </h3>
              <p className="text-xs text-gray-500">{event.location}</p>
            </Link>
          ))}
        </div>
        </section>
      )}

      {/* 팝업스토어 BEST */}
      {(selectedCategory === 'all' || selectedCategory === 'popup') && (
        <section className="py-4 pb-8">
          <div className="px-4 mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">팝업스토어 BEST</h2>
            <button
              onClick={() => navigate('/events?category=popup')}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-pink-500 transition-colors"
            >
              더보기
              <ChevronRight size={16} />
            </button>
          </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar px-4">
          {popupEvents.slice(0, 6).map((event) => (
            <Link
              key={event.id}
              to={`/events/${event.id}`}
              className="flex-shrink-0 w-40"
            >
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-md mb-2">
                <img
                  src={event.poster_image}
                  alt={event.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                    팝업
                  </span>
                </div>
              </div>
              <h3 className="text-sm font-bold text-gray-900 line-clamp-2 mb-1">
                {event.name}
              </h3>
              <p className="text-xs text-gray-500">{event.location}</p>
            </Link>
          ))}
        </div>
        </section>
      )}
    </div>
  );
}
