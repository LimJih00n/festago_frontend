import axios from './axios';

/**
 * 로그인
 */
export const login = async (credentials) => {
  const response = await axios.post('/api/auth/login/', credentials);
  return response;
};

/**
 * 회원가입
 */
export const signup = async (userData) => {
  const response = await axios.post('/api/users/signup/', userData);
  return response;
};

/**
 * 토큰 갱신
 */
export const refreshToken = async (refresh) => {
  const response = await axios.post('/api/auth/refresh/', { refresh });
  return response;
};

/**
 * 로그아웃
 */
export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

/**
 * 현재 사용자 정보 가져오기
 */
export const getCurrentUser = async () => {
  const response = await axios.get('/api/users/me/');
  return response;
};

/**
 * 프로필 업데이트
 */
export const updateProfile = async (userData) => {
  const response = await axios.patch('/api/users/me/', userData);
  return response;
};

/**
 * 로그인 상태 확인
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('access_token');
};
