import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Calendar, MapPin, Star } from 'lucide-react';
import { getEvents } from '../api/events';
import MobileHeader from '../components/mobile/MobileHeader';

export default function EventListPage() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categoryLabels = {
    festival: '축제',
    concert: '공연',
    exhibition: '전시',
    popup: '팝업스토어',
  };

  const categoryColors = {
    festival: 'bg-pink-500',
    concert: 'bg-purple-500',
    exhibition: 'bg-blue-500',
    popup: 'bg-green-500',
  };

  useEffect(() => {
    fetchEvents();
  }, [category]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = category ? { category } : {};
      const response = await getEvents(params);
      setEvents(response.data.results || response.data);
    } catch (err) {
      console.error('이벤트 로딩 실패:', err);
      setError('이벤트를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <MobileHeader showBackButton={true} title={categoryLabels[category] || '전체 이벤트'} showLogo={false} />
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
        <MobileHeader showBackButton={true} title={categoryLabels[category] || '전체 이벤트'} showLogo={false} />
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
    <div className="min-h-screen bg-gray-50 pb-20">
      <MobileHeader
        showBackButton={true}
        title={categoryLabels[category] || '전체 이벤트'}
        showLogo={false}
      />

      <div className="px-4 py-4">
        {/* 헤더 정보 */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            총 <span className="font-bold text-pink-500">{events.length}</span>개의 이벤트
          </p>
        </div>

        {/* 이벤트 그리드 */}
        {events.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {events.map((event) => (
              <Link
                key={event.id}
                to={`/events/${event.id}`}
                className="mobile-card overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* 이벤트 포스터 */}
                <div className="relative aspect-[3/4] bg-gray-200">
                  <img
                    src={event.poster_image}
                    alt={event.name}
                    className="w-full h-full object-cover"
                  />
                  {/* 카테고리 뱃지 */}
                  <div className="absolute top-2 left-2">
                    <span className={`px-2 py-1 ${categoryColors[event.category] || 'bg-gray-500'} text-white text-xs font-medium rounded-full`}>
                      {categoryLabels[event.category] || event.category}
                    </span>
                  </div>
                  {/* 평점 */}
                  {event.average_rating > 0 && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full">
                      <Star size={12} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-xs text-white font-semibold">
                        {event.average_rating}
                      </span>
                    </div>
                  )}
                </div>

                {/* 이벤트 정보 */}
                <div className="p-3">
                  <h3 className="text-sm font-bold text-gray-900 line-clamp-2 mb-2 min-h-[2.5rem]">
                    {event.name}
                  </h3>

                  <div className="space-y-1 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin size={12} className="text-pink-500 flex-shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={12} className="text-pink-500 flex-shrink-0" />
                      <span className="truncate">
                        {event.start_date} ~ {event.end_date}
                      </span>
                    </div>
                  </div>

                  {/* 리뷰 정보 */}
                  {event.review_count > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <p className="text-xs text-gray-500">
                        리뷰 {event.review_count}개
                      </p>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎪</div>
            <p className="text-gray-500">등록된 이벤트가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
