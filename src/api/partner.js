import axios from './axios';

// 파트너 회원가입
export const partnerSignup = (data) => axios.post('/api/partners/signup/', data);

// 사업자 프로필
export const partnerAPI = {
  // 내 프로필 조회
  getMyProfile: () => axios.get('/api/partners/partners/me/'),

  // 프로필 수정
  updateProfile: (id, data) => axios.put(`/api/partners/partners/${id}/`, data),

  // 공개 프로필 조회
  getPublicProfile: (id) => axios.get(`/api/partners/partners/${id}/public/`),
};

// 지원서
export const applicationAPI = {
  // 내 지원 내역
  getMyApplications: (params) => axios.get('/api/partners/applications/', { params }),

  // 지원서 상세
  getApplication: (id) => axios.get(`/api/partners/applications/${id}/`),

  // 지원하기
  createApplication: (data) => axios.post('/api/partners/applications/', data),

  // 지원서 수정
  updateApplication: (id, data) => axios.put(`/api/partners/applications/${id}/`, data),

  // 지원 취소
  cancelApplication: (id) => axios.delete(`/api/partners/applications/${id}/`),

  // 통계
  getStats: () => axios.get('/api/partners/applications/stats/'),
};

// 대시보드
export const dashboardAPI = {
  getDashboard: () => axios.get('/api/partners/dashboard/'),
};

// 축제 탐색 (사업자용)
export const partnerFestivalAPI = {
  getFestivals: (params) => axios.get('/api/partners/festivals/', { params }),
};

// 메시지
export const messageAPI = {
  // 받은편지함
  getInbox: () => axios.get('/api/partners/messages/inbox/'),

  // 보낸편지함
  getSent: () => axios.get('/api/partners/messages/sent/'),

  // 읽지 않은 메시지 개수
  getUnreadCount: () => axios.get('/api/partners/messages/unread_count/'),

  // 메시지 읽음 처리
  markAsRead: (id) => axios.post(`/api/partners/messages/${id}/mark_read/`),

  // 메시지 보내기
  sendMessage: (data) => axios.post('/api/partners/messages/', data),
};

// 성과 데이터
export const analyticsAPI = {
  getAnalytics: () => axios.get('/api/partners/analytics/'),
  getAnalyticsDetail: (id) => axios.get(`/api/partners/analytics/${id}/`),
  getSummary: () => axios.get('/api/partners/analytics/summary/'),
  exportPDF: (id) => axios.get(`/api/partners/analytics/${id}/export-pdf/`, { responseType: 'blob' }),
};

// 알림
export const notificationAPI = {
  // 알림 목록
  getNotifications: (params) => axios.get('/api/partners/notifications/', { params }),

  // 읽지 않은 알림
  getUnread: () => axios.get('/api/partners/notifications/unread/'),

  // 읽지 않은 개수
  getUnreadCount: () => axios.get('/api/partners/notifications/unread_count/'),

  // 읽음 처리
  markAsRead: (id) => axios.post(`/api/partners/notifications/${id}/mark_read/`),

  // 전체 읽음
  markAllAsRead: () => axios.post('/api/partners/notifications/mark_all_read/'),

  // 타입별 조회
  getByType: (type) => axios.get(`/api/partners/notifications/by-type/${type}/`),
};

// 파일 업로드
export const uploadAPI = {
  // 이미지 업로드
  uploadImage: (formData) => axios.post('/api/partners/uploads/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),

  // 사업자등록증 업로드
  uploadCertificate: (formData) => axios.post('/api/partners/uploads/upload-certificate/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),

  // 내 업로드 목록
  getMyUploads: () => axios.get('/api/partners/uploads/'),

  // 타입별 조회
  getByType: (type) => axios.get(`/api/partners/uploads/by-type/${type}/`),

  // 업로드 통계
  getStats: () => axios.get('/api/partners/uploads/stats/'),

  // 삭제
  deleteUpload: (id) => axios.delete(`/api/partners/uploads/${id}/`),
};

// 임시저장
export const draftAPI = {
  // 임시저장 목록
  getDrafts: () => axios.get('/api/partners/drafts/'),

  // 임시저장 생성
  createDraft: (data) => axios.post('/api/partners/drafts/', data),

  // 임시저장 수정
  updateDraft: (id, data) => axios.put(`/api/partners/drafts/${id}/`, data),

  // 임시저장 삭제
  deleteDraft: (id) => axios.delete(`/api/partners/drafts/${id}/`),

  // 축제별 임시저장 조회
  getByEvent: (eventId) => axios.get(`/api/partners/drafts/by-event/${eventId}/`),
};

// 북마크
export const bookmarkAPI = {
  // 북마크 목록
  getBookmarks: () => axios.get('/api/partners/bookmarks/'),

  // 북마크 추가
  addBookmark: (data) => axios.post('/api/partners/bookmarks/', data),

  // 북마크 삭제
  deleteBookmark: (id) => axios.delete(`/api/partners/bookmarks/${id}/`),

  // 북마크 토글
  toggle: (eventId) => axios.post(`/api/partners/bookmarks/toggle/${eventId}/`),

  // 북마크 확인
  check: (eventId) => axios.get(`/api/partners/bookmarks/check/${eventId}/`),
};

// 엑셀 다운로드
export const exportAPI = {
  // 지원서 엑셀 다운로드
  exportApplicationsExcel: () => axios.get('/api/partners/applications/export-excel/', { responseType: 'blob' }),
};
