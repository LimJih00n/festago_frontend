import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ChevronDown } from 'lucide-react';
import { getEvent } from '../api/events';
import { getEventReviews } from '../api/reviews';
import MobileHeader from '../components/mobile/MobileHeader';

export default function ReviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('list'); // 'list' or 'write'
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'rating'

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [eventRes, reviewsRes] = await Promise.all([
        getEvent(id),
        getEventReviews(id),
      ]);
      setEvent(eventRes.data);
      setReviews(reviewsRes.data);
    } catch (err) {
      console.error('데이터 로딩 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  // 별점 분포 계산
  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((review) => {
      distribution[review.rating]++;
    });
    return distribution;
  };

  // 정렬된 리뷰
  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === 'rating') {
      return b.rating - a.rating;
    }
    return new Date(b.created_at) - new Date(a.created_at);
  });

  if (loading) {
    return (
      <>
        <MobileHeader showBackButton={true} title="리뷰" showLogo={false} />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent mb-4"></div>
            <p className="text-gray-600">로딩 중...</p>
          </div>
        </div>
      </>
    );
  }

  const ratingDistribution = getRatingDistribution();
  const totalReviews = reviews.length;
  const averageRating = event?.average_rating || 0;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <MobileHeader showBackButton={true} title={event?.name} showLogo={false} />

      {/* Tabs */}
      <div className="bg-white sticky top-14 z-10 border-b">
        <div className="flex">
          <button
            onClick={() => setActiveTab('list')}
            className={`flex-1 py-4 text-center font-semibold transition-colors ${
              activeTab === 'list'
                ? 'text-pink-500 border-b-2 border-pink-500'
                : 'text-gray-500'
            }`}
          >
            방문자 리뷰
          </button>
          <button
            onClick={() => setActiveTab('write')}
            className={`flex-1 py-4 text-center font-semibold transition-colors ${
              activeTab === 'write'
                ? 'text-pink-500 border-b-2 border-pink-500'
                : 'text-gray-500'
            }`}
          >
            리뷰 작성
          </button>
        </div>
      </div>

      {activeTab === 'list' ? (
        <>
          {/* 평균 별점 & 분포 */}
          <div className="bg-white px-4 py-6 mb-2">
            <div className="flex items-center gap-6 mb-6">
              {/* 평균 별점 */}
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">MY STAR 평균</div>
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Star size={32} className="text-yellow-400 fill-yellow-400" />
                </div>
                <div className="text-4xl font-bold text-gray-900">
                  {averageRating.toFixed(1)}
                </div>
              </div>

              {/* 별점 분포 */}
              <div className="flex-1">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = ratingDistribution[rating];
                  const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

                  return (
                    <div key={rating} className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-gray-600 w-4">{rating}</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-pink-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 정렬 드롭다운 */}
          <div className="bg-white px-4 py-3 flex items-center justify-between mb-2">
            <span className="text-sm text-gray-700">
              총 {totalReviews}개의 리뷰
            </span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-1.5 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="recent">베스트순</option>
                <option value="rating">별점높은순</option>
              </select>
              <ChevronDown
                size={16}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
          </div>

          {/* 리뷰 리스트 */}
          <div className="space-y-2">
            {sortedReviews.length > 0 ? (
              sortedReviews.map((review) => (
                <div key={review.id} className="bg-white px-4 py-4">
                  {/* 사용자 정보 & 별점 */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-semibold">
                          {review.user_name?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        {review.user_name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star
                        size={16}
                        className="text-yellow-400 fill-yellow-400"
                      />
                      <span className="text-sm font-semibold text-gray-900">
                        {review.rating}.0
                      </span>
                    </div>
                  </div>

                  {/* 리뷰 이미지 */}
                  {review.images && review.images.length > 0 && (
                    <div className="mb-3">
                      <img
                        src={review.images[0]}
                        alt="리뷰 이미지"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}

                  {/* 리뷰 내용 */}
                  <p className="text-sm text-gray-700 leading-relaxed mb-2">
                    {review.comment}
                  </p>

                  {/* 작성일 */}
                  <span className="text-xs text-gray-400">
                    {new Date(review.created_at).toLocaleDateString('ko-KR')}
                  </span>
                </div>
              ))
            ) : (
              <div className="bg-white px-4 py-12 text-center">
                <p className="text-gray-500">아직 작성된 리뷰가 없습니다.</p>
                <p className="text-sm text-gray-400 mt-2">
                  첫 번째 리뷰를 작성해보세요!
                </p>
              </div>
            )}
          </div>
        </>
      ) : (
        /* 리뷰 작성 탭 - 작성 폼으로 교체 예정 */
        <div className="bg-white px-4 py-12 text-center">
          <p className="text-gray-500">리뷰 작성 폼이 여기에 표시됩니다.</p>
          <button
            onClick={() => navigate(`/events/${id}/reviews/write`)}
            className="mt-4 px-6 py-2 bg-pink-500 text-white rounded-lg"
          >
            리뷰 작성하기
          </button>
        </div>
      )}

      {/* 하단 리뷰쓰기 버튼 (리뷰 리스트 탭에만 표시) */}
      {activeTab === 'list' && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t safe-area-inset-bottom">
          <button
            onClick={() => navigate(`/events/${id}/reviews/write`)}
            className="w-full py-4 bg-pink-500 text-white rounded-2xl font-semibold shadow-lg"
          >
            리뷰쓰기
          </button>
        </div>
      )}
    </div>
  );
}
