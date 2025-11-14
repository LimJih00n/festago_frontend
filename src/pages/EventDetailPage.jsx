import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Home, ExternalLink, Share2, Star } from 'lucide-react';
import { getEvent } from '../api/events';
import MobileHeader from '../components/mobile/MobileHeader';
import BookmarkButton from '../components/events/BookmarkButton';

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const response = await getEvent(id);
      setEvent(response.data);
      setError(null);
    } catch (err) {
      setError('데이터를 불러오는데 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.name,
          text: event.description,
          url: window.location.href,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('공유 실패:', err);
        }
      }
    } else {
      alert('이 브라우저는 공유 기능을 지원하지 않습니다.');
    }
  };

  if (loading) {
    return (
      <>
        <MobileHeader showBackButton={true} title="상세정보" showLogo={false} />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent mb-4"></div>
            <p className="text-gray-600">로딩 중...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !event) {
    return (
      <>
        <MobileHeader showBackButton={true} title="상세정보" showLogo={false} />
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="text-center">
            <div className="text-4xl mb-4">😢</div>
            <p className="text-lg text-red-500">{error || '이벤트를 찾을 수 없습니다.'}</p>
          </div>
        </div>
      </>
    );
  }

  const categoryLabels = {
    festival: '축제',
    concert: '공연',
    exhibition: '전시',
    popup: '팝업스토어',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader showBackButton={true} title={event.name} showNotification={false} showLogo={false} />

      {/* Poster Image - 전체 너비 */}
      <div className="relative aspect-[16/9] bg-gradient-to-br from-pink-100 to-pink-200">
        <img
          src={event.poster_image}
          alt={event.name}
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        {/* 카테고리 뱃지 */}
        <div className="absolute top-4 left-4">
          <span className="px-4 py-2 bg-black/60 backdrop-blur-sm text-white text-sm font-medium rounded-full">
            {categoryLabels[event.category] || event.category}
          </span>
        </div>
        {/* 공유 및 북마크 버튼 */}
        <div className="absolute top-4 right-4 flex gap-2">
          <BookmarkButton
            eventId={event.id}
            isBookmarked={event.is_bookmarked}
            className="bg-black/60 backdrop-blur-sm"
          />
          <button
            onClick={handleShare}
            className="p-3 bg-black/60 backdrop-blur-sm rounded-full touch-feedback"
          >
            <Share2 size={20} className="text-white" />
          </button>
        </div>
      </div>

      {/* Event Info - 앱 스타일 */}
      <main className="px-4 py-4">
        <div className="mobile-card">
          <div className="p-5">
            {/* 제목 */}
            <h1 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
              {event.name}
            </h1>

            {/* 정보 카드 */}
            <div className="space-y-3 mb-6">
              {/* 위치 */}
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                <MapPin size={20} className="text-pink-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{event.location}</p>
                  {event.address && (
                    <p className="text-xs text-gray-500 mt-1">{event.address}</p>
                  )}
                </div>
              </div>

              {/* 기간 */}
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                <Calendar size={20} className="text-pink-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {event.start_date} ~ {event.end_date}
                  </p>
                </div>
              </div>
            </div>

            {/* 상세 설명 */}
            <div className="border-t pt-5">
              <h2 className="text-lg font-bold text-gray-900 mb-3">상세 설명</h2>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>

            {/* 리뷰 평점 섹션 */}
            <div className="border-t pt-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-gray-900">방문자 리뷰</h2>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Star size={24} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-2xl font-bold text-gray-900">
                    {event.average_rating || 0}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  리뷰 {event.review_count || 0}개
                </div>
              </div>

              <button
                onClick={() => navigate(`/events/${id}/reviews`)}
                className="w-full py-3 border border-pink-500 text-pink-500 rounded-xl font-semibold hover:bg-pink-50 transition-colors"
              >
                리뷰 전체보기
              </button>
            </div>
          </div>
        </div>

        {/* 하단 액션 버튼 */}
        {event.website_url && (
          <div className="mt-4 pb-20">
            <a
              href={event.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-4 bg-pink-500 text-white rounded-2xl font-semibold shadow-lg touch-feedback"
            >
              <ExternalLink size={20} />
              <span>공식 웹사이트 방문</span>
            </a>
          </div>
        )}
      </main>
    </div>
  );
}
