import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, Phone, ChevronLeft } from 'lucide-react';
import { signup } from '../api/auth';

export default function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
    phone: '',
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

    // 유효성 검사
    if (formData.password !== formData.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (formData.password.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await signup({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        user_type: 'consumer',
      });

      alert('회원가입이 완료되었습니다!');
      navigate('/login/email');
    } catch (err) {
      console.error('회원가입 실패:', err);
      if (err.response?.data) {
        const errors = err.response.data;
        const errorMessages = Object.values(errors).flat().join('\n');
        setError(errorMessages || '회원가입에 실패했습니다.');
      } else {
        setError('회원가입에 실패했습니다.');
      }
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
        <h2 className="text-lg font-semibold text-gray-900">회원가입</h2>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        {/* 로고 */}
        <div className="mb-8">
          <img
            src="/images/login_logo.svg"
            alt="FESTAGO"
            className="h-16 w-auto"
          />
        </div>

        {/* 회원가입 폼 */}
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
          {/* 에러 메시지 */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl text-sm whitespace-pre-line">
              {error}
            </div>
          )}

          {/* 이름/닉네임 */}
          <div className="relative">
            <UserIcon
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
              size={20}
            />
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="이름 또는 닉네임"
              required
              className="w-full pl-12 pr-4 py-3.5 bg-pink-100 border-2 border-pink-400 rounded-xl text-gray-900 placeholder-gray-600 focus:outline-none focus:border-pink-500 transition-colors"
            />
          </div>

          {/* 이메일 */}
          <div className="relative">
            <Mail
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
              size={20}
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="이메일"
              required
              className="w-full pl-12 pr-4 py-3.5 bg-pink-100 border-2 border-pink-400 rounded-xl text-gray-900 placeholder-gray-600 focus:outline-none focus:border-pink-500 transition-colors"
            />
          </div>

          {/* 전화번호 */}
          <div className="relative">
            <Phone
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
              size={20}
            />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="전화번호 (선택)"
              className="w-full pl-12 pr-4 py-3.5 bg-pink-100 border-2 border-pink-400 rounded-xl text-gray-900 placeholder-gray-600 focus:outline-none focus:border-pink-500 transition-colors"
            />
          </div>

          {/* 비밀번호 */}
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
              placeholder="비밀번호 (8자 이상)"
              required
              minLength={8}
              className="w-full pl-12 pr-4 py-3.5 bg-pink-100 border-2 border-pink-400 rounded-xl text-gray-900 placeholder-gray-600 focus:outline-none focus:border-pink-500 transition-colors"
            />
          </div>

          {/* 비밀번호 확인 */}
          <div className="relative">
            <Lock
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
              size={20}
            />
            <input
              type="password"
              name="passwordConfirm"
              value={formData.passwordConfirm}
              onChange={handleChange}
              placeholder="비밀번호 확인"
              required
              className="w-full pl-12 pr-4 py-3.5 bg-pink-100 border-2 border-pink-400 rounded-xl text-gray-900 placeholder-gray-600 focus:outline-none focus:border-pink-500 transition-colors"
            />
          </div>

          {/* 회원가입 버튼 */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3.5 rounded-full font-medium text-sm hover:bg-gray-900 transition-colors shadow-md mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '가입 중...' : '회원가입'}
          </button>

          {/* 로그인 링크 */}
          <div className="text-center pt-4">
            <p className="text-sm text-gray-700">
              이미 계정이 있으신가요?{' '}
              <button
                type="button"
                onClick={() => navigate('/login/email')}
                className="text-gray-900 font-semibold hover:underline"
              >
                로그인
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
