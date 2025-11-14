import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Calendar } from 'lucide-react';
import { getEvents } from '../api/events';
import MobileHeader from '../components/mobile/MobileHeader';

export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchEvents();
  }, [category]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = {};
      if (category) params.category = category;
      if (search) params.search = search;

      const response = await getEvents(params);
      setEvents(response.data.results || response.data);
      setError(null);
    } catch (err) {
      setError('데이터를 불러오는데 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEvents();
  };

  const categories = [
    { value: '', label: '전체' },
    { value: 'festival', label: '축제' },
    { value: 'concert', label: '공연' },
    { value: 'exhibition', label: '전시' },
    { value: 'popup', label: '팝업' },
  ];

  if (loading) {
    return (
      <>
        <MobileHeader />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent mb-4"></div>
            <p className="text-gray-600">로딩 중...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <MobileHeader />
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="text-center">
            <div className="text-4xl mb-4">😢</div>
            <p className="text-lg text-red-500">{error}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader showMenu={false} showNotification={true} />

      {/* Main Content */}
      <main className="px-4 py-4">
        {/* Search Bar - 앱 스타일 */}
        <form onSubmit={handleSearch} className="mb-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="축제를 검색해보세요"
              className="w-full pl-12 pr-4 py-3.5 bg-white rounded-xl border border-gray-200
                       focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent
                       text-base placeholder-gray-400"
            />
          </div>
        </form>

        {/* 카테고리 칩 - 가로 스크롤 */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`
                px-5 py-2.5 rounded-full font-medium whitespace-nowrap
                transition-all duration-200 touch-feedback
                ${category === cat.value
                  ? 'bg-pink-500 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-200'
                }
              `}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Events Feed - 앱 스타일 카드 */}
        <div className="space-y-4 mt-4">
          {events.map((event) => (
            <Link
              key={event.id}
              to={`/events/${event.id}`}
              className="mobile-card block"
            >
              {/* 이미지 */}
              <div className="relative aspect-[16/9] bg-gradient-to-br from-pink-100 to-pink-200">
                <img
                  src={event.poster_image}
                  alt={event.name}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
                {/* 카테고리 뱃지 */}
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 bg-black/50 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                    {categories.find(c => c.value === event.category)?.label || '축제'}
                  </span>
                </div>
              </div>

              {/* 정보 */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                  {event.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {event.description}
                </p>

                {/* 메타 정보 */}
                <div className="flex flex-col gap-2 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-pink-500 flex-shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-pink-500 flex-shrink-0" />
                    <span className="truncate">
                      {event.start_date} ~ {event.end_date}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-500">검색 결과가 없습니다</p>
          </div>
        )}
      </main>
    </div>
  );
}
