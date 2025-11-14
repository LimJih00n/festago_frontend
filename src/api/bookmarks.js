// 서버 기반 북마크 API (인증 필요)
import api from './axios';

/**
 * 모든 북마크 조회 (로그인한 사용자)
 * @returns {Promise} 북마크 리스트
 */
export const getBookmarks = () => api.get('/api/events/bookmarks/');

/**
 * 북마크 추가
 * @param {number} eventId - 이벤트 ID
 * @returns {Promise}
 */
export const addBookmark = (eventId) =>
  api.post('/api/events/bookmarks/', { event_id: eventId });

/**
 * 북마크 삭제
 * @param {number} bookmarkId - 북마크 ID
 * @returns {Promise}
 */
export const removeBookmark = (bookmarkId) =>
  api.delete(`/api/events/bookmarks/${bookmarkId}/`);

/**
 * 이벤트 ID로 북마크 삭제
 * @param {number} eventId - 이벤트 ID
 * @returns {Promise}
 */
export const removeBookmarkByEvent = (eventId) =>
  api.delete('/api/events/bookmarks/remove_by_event/', {
    params: { event_id: eventId }
  });

/**
 * 북마크 토글 (추가/삭제)
 * @param {number} eventId - 이벤트 ID
 * @param {boolean} isBookmarked - 현재 북마크 상태
 * @returns {Promise}
 */
export const toggleBookmark = async (eventId, isBookmarked) => {
  if (isBookmarked) {
    return await removeBookmarkByEvent(eventId);
  } else {
    return await addBookmark(eventId);
  }
};
