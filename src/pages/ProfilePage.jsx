import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Heart, Star, Settings, LogOut, ChevronRight } from 'lucide-react';
import { getBookmarks } from '../api/bookmarks';
import { getMyReviews } from '../api/reviews';
import { getCurrentUser } from '../api/auth';
import MobileHeader from '../components/mobile/MobileHeader';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bookmarks'); // 'bookmarks' or 'reviews'

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);

      // 로그인 상태 확인
      const token = localStorage.getItem('access_token');
      if (!token) {
        // 로그인되지 않았으면 로그인 페이지로
        navigate('/login');
        return;
      }

      // 사용자 정보, 북마크, 리뷰 가져오기
      const [userRes, bookmarksRes, reviewsRes] = await Promise.all([
        getCurrentUser(),
        getBookmarks(),
        getMyReviews(),
      ]);

      setUser(userRes.data);
      // 페이지네이션 응답 처리 (results 배열 또는 직접 배열)
      setBookmarks(bookmarksRes.data?.results || bookmarksRes.data || []);
      setReviews(reviewsRes.data?.results || reviewsRes.data || []);
    } catch (err) {
      console.error('데이터 로딩 실패:', err);
      // 인증 실패 시 로그인 페이지로
      if (err.response?.status === 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('username');
      navigate('/login');
    }
  };

  if (loading) {
    return (
      <>
        <MobileHeader title="마이페이지" showNotification={false} />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent mb-4"></div>
            <p className="text-gray-600">로딩 중...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <MobileHeader title="마이페이지" showNotification={false} />

      {/* 프로필 정보 */}
      <div className="bg-white px-4 py-6 mb-2">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
            <User size={32} className="text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              {user?.username || '사용자'}
            </h2>
            {user?.email && (
              <p className="text-sm text-gray-500">{user.email}</p>
            )}
          </div>
          <button
            onClick={() => navigate('/profile/edit')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Settings size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* 통계 */}
      <div className="bg-white px-4 py-4 mb-2">
        <div className="flex justify-around">
          <div className="text-center">
            <div className="text-2xl font-bold text-pink-500">
              {bookmarks.length}
            </div>
            <div className="text-xs text-gray-500 mt-1">북마크</div>
          </div>
          <div className="w-px bg-gray-200"></div>
          <div className="text-center">
            <div className="text-2xl font-bold text-pink-500">
              {reviews.length}
            </div>
            <div className="text-xs text-gray-500 mt-1">리뷰</div>
          </div>
          <div className="w-px bg-gray-200"></div>
          <div className="text-center">
            <div className="text-2xl font-bold text-pink-500">
              {reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1) || 0}
            </div>
            <div className="text-xs text-gray-500 mt-1">평균 별점</div>
          </div>
        </div>
      </div>

      {/* 탭 */}
      <div className="bg-white sticky top-14 z-10 border-b mb-2">
        <div className="flex">
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`flex-1 py-4 text-center font-semibold transition-colors ${
              activeTab === 'bookmarks'
                ? 'text-pink-500 border-b-2 border-pink-500'
                : 'text-gray-500'
            }`}
          >
            북마크한 축제
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex-1 py-4 text-center font-semibold transition-colors ${
              activeTab === 'reviews'
                ? 'text-pink-500 border-b-2 border-pink-500'
                : 'text-gray-500'
            }`}
          >
            내가 쓴 리뷰
          </button>
        </div>
      </div>

      {/* 콘텐츠 */}
      {activeTab === 'bookmarks' ? (
        <div className="space-y-2">
          {bookmarks.length > 0 ? (
            bookmarks.map((bookmark) => (
              <div
                key={bookmark.id}
                onClick={() => navigate(`/events/${bookmark.event.id}`)}
                className="bg-white px-4 py-4 cursor-pointer active:bg-gray-50"
              >
                <div className="flex gap-3">
                  <img
                    src={bookmark.event.poster_image}
                    alt={bookmark.event.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                      {bookmark.event.name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-1">
                      {bookmark.event.location}
                    </p>
                    <p className="text-xs text-gray-400">
                      {bookmark.event.start_date} ~ {bookmark.event.end_date}
                    </p>
                  </div>
                  <ChevronRight size={20} className="text-gray-400 flex-shrink-0" />
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white px-4 py-12 text-center">
              <Heart size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 mb-2">북마크한 축제가 없습니다</p>
              <p className="text-sm text-gray-400">
                관심있는 축제를 저장해보세요!
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div
                key={review.id}
                onClick={() => navigate(`/events/${review.event}/reviews`)}
                className="bg-white px-4 py-4 cursor-pointer active:bg-gray-50"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 line-clamp-1 flex-1">
                    {review.event_name}
                  </h3>
                  <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-semibold text-gray-900">
                      {review.rating}.0
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-700 line-clamp-2 mb-2">
                  {review.comment}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(review.created_at).toLocaleDateString('ko-KR')}
                </p>
              </div>
            ))
          ) : (
            <div className="bg-white px-4 py-12 text-center">
              <Star size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 mb-2">작성한 리뷰가 없습니다</p>
              <p className="text-sm text-gray-400">
                다녀온 축제에 리뷰를 남겨보세요!
              </p>
            </div>
          )}
        </div>
      )}

      {/* 하단 로그아웃 버튼 */}
      <div className="px-4 mt-6">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
        >
          <LogOut size={20} />
          <span>로그아웃</span>
        </button>
      </div>
    </div>
  );
}
