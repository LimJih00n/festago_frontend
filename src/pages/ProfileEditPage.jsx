import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Camera, Save } from 'lucide-react';
import { getCurrentUser, updateProfile } from '../api/auth';

export default function ProfileEditPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    first_name: '',
    last_name: '',
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await getCurrentUser();
      const user = response.data;

      setFormData({
        username: user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
      });
    } catch (err) {
      console.error('사용자 정보 로딩 실패:', err);
      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // 유효성 검사
    if (!formData.username.trim()) {
      setError('닉네임을 입력해주세요.');
      return;
    }

    if (!formData.email.trim()) {
      setError('이메일을 입력해주세요.');
      return;
    }

    // 이메일 형식 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('올바른 이메일 형식을 입력해주세요.');
      return;
    }

    try {
      setSaving(true);
      await updateProfile(formData);
      setSuccess('프로필이 성공적으로 수정되었습니다.');

      // 잠시 후 프로필 페이지로 이동
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    } catch (err) {
      console.error('프로필 수정 실패:', err);
      if (err.response?.data) {
        // 백엔드 에러 메시지 표시
        const errorData = err.response.data;
        if (typeof errorData === 'object') {
          const firstError = Object.values(errorData)[0];
          setError(Array.isArray(firstError) ? firstError[0] : firstError);
        } else {
          setError(errorData);
        }
      } else {
        setError('프로필 수정 중 오류가 발생했습니다.');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 active:scale-95 transition-transform"
          >
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">프로필 수정</h1>
          <div className="w-10"></div>
        </div>
      </header>

      {/* 프로필 이미지 */}
      <div className="bg-white px-4 py-8 mb-2 flex flex-col items-center">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
            <User size={48} className="text-white" />
          </div>
          <button className="absolute bottom-0 right-0 w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center shadow-lg">
            <Camera size={16} className="text-white" />
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-3">프로필 사진 변경</p>
      </div>

      {/* 폼 */}
      <form onSubmit={handleSubmit} className="bg-white px-4 py-6">
        {/* 에러 메시지 */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* 성공 메시지 */}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-600">{success}</p>
          </div>
        )}

        {/* 닉네임 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            닉네임 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="닉네임을 입력하세요"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
          />
        </div>

        {/* 이메일 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            이메일 <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="이메일을 입력하세요"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
          />
        </div>

        {/* 이름 */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              성
            </label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="성"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이름
            </label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="이름"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
            />
          </div>
        </div>

        {/* 전화번호 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            전화번호
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="010-0000-0000"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
          />
        </div>

        {/* 저장 버튼 */}
        <button
          type="submit"
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 py-4 bg-pink-500 text-white rounded-xl font-semibold hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              <span>저장 중...</span>
            </>
          ) : (
            <>
              <Save size={20} />
              <span>저장하기</span>
            </>
          )}
        </button>
      </form>

      {/* 비밀번호 변경 섹션 */}
      <div className="bg-white px-4 py-4 mt-2">
        <button
          onClick={() => alert('비밀번호 변경 기능은 준비 중입니다.')}
          className="w-full py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
        >
          비밀번호 변경
        </button>
      </div>

      {/* 회원 탈퇴 */}
      <div className="px-4 py-4 mt-2">
        <button
          onClick={() => alert('회원 탈퇴 기능은 준비 중입니다.')}
          className="w-full text-center text-sm text-gray-400 hover:text-red-500 transition-colors"
        >
          회원 탈퇴
        </button>
      </div>
    </div>
  );
}
