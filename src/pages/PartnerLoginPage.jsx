import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, X } from 'lucide-react';
import api from '../api/axios';
import { useAuthStore } from '../utils/store';

export default function PartnerLoginPage() {
  const navigate = useNavigate();
  const authLogin = useAuthStore((state) => state.login);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/api/auth/login/', {
        username: formData.username,
        password: formData.password,
      });

      const data = response.data;

      // 토큰 저장 및 인증 상태 업데이트
      authLogin(
        { access: data.access, refresh: data.refresh },
        { username: formData.username }
      );
      localStorage.setItem('username', formData.username);

      // 파트너 대시보드로 이동
      navigate('/partner/dashboard');
    } catch (err) {
      console.error('로그인 실패:', err);
      setError('아이디 또는 비밀번호가 올바르지 않습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-pink-200 via-pink-300 to-pink-200 flex flex-col overflow-y-auto overscroll-none">
      {/* 헤더 */}
      <div className="p-4 flex justify-between items-center">
        <h2 className="text-sm font-medium text-gray-800">기업 전용 로그인화면</h2>
        <button onClick={() => navigate('/login')} className="p-1">
          <X size={24} className="text-gray-800" />
        </button>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {/* 파트너 전용 뱃지 */}
        <div className="mb-8">
          <div className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium">
            파트너 전용
          </div>
        </div>

        {/* 로고 */}
        <div className="mb-12">
          <img
            src="/images/login_logo.svg"
            alt="FESTAGO"
            className="h-20 w-auto"
          />
        </div>

        {/* 로그인 폼 */}
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
          {/* 에러 메시지 */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* 아이디 입력 */}
          <div className="relative">
            <User
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
              size={20}
            />
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="아이디"
              required
              className="w-full pl-12 pr-4 py-3.5 bg-pink-100 border-2 border-pink-400 rounded-xl text-gray-900 placeholder-gray-600 focus:outline-none focus:border-pink-500 transition-colors"
            />
          </div>

          {/* 비밀번호 입력 */}
          <div className="relative">
            <Lock
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
              size={20}
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="비밀번호"
              required
              className="w-full pl-12 pr-4 py-3.5 bg-pink-100 border-2 border-pink-400 rounded-xl text-gray-900 placeholder-gray-600 focus:outline-none focus:border-pink-500 transition-colors"
            />
          </div>

          {/* 로그인 버튼 */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3.5 rounded-full font-medium text-sm hover:bg-gray-900 transition-colors shadow-md mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>

          {/* 회원가입 링크 */}
          <div className="text-center pt-4">
            <button
              type="button"
              onClick={() => navigate('/signup/partner')}
              className="text-sm text-gray-800 hover:text-gray-900 font-medium"
            >
              회원가입
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
