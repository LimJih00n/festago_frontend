// 리뷰 API
import api from './axios';

/**
 * 모든 리뷰 조회
 * @param {Object} params - 쿼리 파라미터 (event, rating 등)
 * @returns {Promise}
 */
export const getReviews = (params) => api.get('/api/reviews/', { params });

/**
 * 특정 이벤트의 리뷰 목록 조회
 * @param {number} eventId - 이벤트 ID
 * @returns {Promise}
 */
export const getEventReviews = (eventId) =>
  api.get(`/api/events/${eventId}/reviews/`);

/**
 * 내가 작성한 리뷰 목록
 * @returns {Promise}
 */
export const getMyReviews = () => api.get('/api/reviews/my_reviews/');

/**
 * 리뷰 상세 조회
 * @param {number} reviewId - 리뷰 ID
 * @returns {Promise}
 */
export const getReview = (reviewId) => api.get(`/api/reviews/${reviewId}/`);

/**
 * 리뷰 작성
 * @param {Object} data - { event, rating, comment, images }
 * @returns {Promise}
 */
export const createReview = (data) => api.post('/api/reviews/', data);

/**
 * 리뷰 수정
 * @param {number} reviewId - 리뷰 ID
 * @param {Object} data - { rating, comment, images }
 * @returns {Promise}
 */
export const updateReview = (reviewId, data) =>
  api.patch(`/api/reviews/${reviewId}/`, data);

/**
 * 리뷰 삭제
 * @param {number} reviewId - 리뷰 ID
 * @returns {Promise}
 */
export const deleteReview = (reviewId) =>
  api.delete(`/api/reviews/${reviewId}/`);
