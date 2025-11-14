import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ChevronLeft } from 'lucide-react';
import { login } from '../api/auth';

export default function EmailLoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
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
      const response = await login({
        username: formData.email,
        password: formData.password,
      });

      // 토큰 저장
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);

      // 홈으로 이동
      navigate('/');
    } catch (err) {
      console.error('로그인 실패:', err);
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-200 via-pink-300 to-pink-200 flex flex-col">
      {/* 헤더 */}
      <div className="p-4 flex items-center gap-4">
        <button onClick={() => navigate('/login')} className="p-1">
          <ChevronLeft size={24} className="text-gray-800" />
        </button>
        <h2 className="text-lg font-semibold text-gray-900">이메일 로그인</h2>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
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

          {/* 이메일 입력 */}
          <div className="relative">
            <Mail
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
              size={20}
            />
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="이메일 또는 아이디"
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

          {/* 하단 링크들 */}
          <div className="text-center pt-4 space-y-3">
            <div className="flex justify-center gap-4 text-sm">
              <button
                type="button"
                onClick={() => navigate('/find-password')}
                className="text-gray-700 hover:text-gray-900"
              >
                비밀번호 찾기
              </button>
              <span className="text-gray-400">|</span>
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="text-gray-800 hover:text-gray-900 font-medium"
              >
                회원가입
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
