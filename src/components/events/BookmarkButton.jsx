import { useState, useEffect } from 'react';
import { toggleBookmark } from '../../api/bookmarks';

export default function BookmarkButton({ eventId, isBookmarked: initialBookmarked, className = '' }) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked || false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setBookmarked(initialBookmarked || false);
  }, [initialBookmarked]);

  const handleToggle = async (e) => {
    e.preventDefault(); // Link 클릭 방지
    e.stopPropagation();

    // 로그인 확인
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('로그인이 필요한 기능입니다.');
      return;
    }

    try {
      setLoading(true);
      await toggleBookmark(eventId, bookmarked);
      setBookmarked(!bookmarked);
    } catch (err) {
      console.error('북마크 토글 실패:', err);
      console.error('응답 데이터:', err.response?.data);
      if (err.response?.status === 401) {
        alert('로그인이 필요한 기능입니다. 다시 로그인해주세요.');
      } else if (err.response?.data?.detail) {
        alert(err.response.data.detail);
      } else if (err.response?.data?.event_id) {
        alert(err.response.data.event_id);
      } else {
        alert('북마크 처리 중 오류가 발생했습니다. 새로고침 후 다시 시도해주세요.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`p-2 rounded-full transition-colors ${
        loading
          ? 'opacity-50 cursor-not-allowed'
          : bookmarked
          ? 'text-red-500 hover:text-red-600 active:text-red-700'
          : 'text-gray-400 hover:text-red-500 active:text-red-600'
      } ${className}`}
      aria-label={bookmarked ? '북마크 취소' : '북마크 추가'}
      title={bookmarked ? '북마크 취소' : '북마크 추가'}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill={bookmarked ? 'currentColor' : 'none'}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  );
}
