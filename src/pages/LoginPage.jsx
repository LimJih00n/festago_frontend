import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { ChevronRight, X } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 에러 메시지 처리
  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      alert(error);
    }
  }, [searchParams]);

  const handleSocialLogin = (provider) => {
    // 백엔드 소셜 로그인 URL로 리다이렉트
    window.location.href = `${API_BASE_URL}/api/auth/${provider}/`;
  };

  const handleGuestBrowse = () => {
    navigate('/');
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-pink-200 via-pink-300 to-pink-200 flex flex-col overflow-hidden overscroll-none">
      {/* 헤더 */}
      <div className="p-4 flex justify-between items-center">
        <h2 className="text-sm font-medium text-gray-800">로그인 화면</h2>
        <button onClick={() => navigate('/')} className="p-1">
          <X size={24} className="text-gray-800" />
        </button>
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

        {/* 파트너 전용 로그인 링크 */}
        <button
          onClick={() => navigate('/login/partner')}
          className="mb-12 flex items-center gap-2 text-sm text-gray-800 hover:text-gray-900"
        >
          <span>파트너 전용 로그인하기</span>
          <ChevronRight size={16} />
        </button>

        {/* SNS 로그인 섹션 */}
        <div className="w-full max-w-sm">
          <p className="text-center text-sm text-gray-700 mb-4">
            sign in with social Networks
          </p>

          {/* SNS 로그인 버튼들 */}
          <div className="flex justify-center gap-6 mb-8">
            <button
              onClick={() => handleSocialLogin('kakao')}
              className="hover:opacity-80 transition-opacity"
              title="카카오 로그인"
            >
              <img
                src="/images/카카오.svg"
                alt="Kakao"
                className="w-12 h-12"
              />
            </button>

            <button
              onClick={() => handleSocialLogin('naver')}
              className="hover:opacity-80 transition-opacity"
              title="네이버 로그인"
            >
              <img
                src="/images/네이버.svg"
                alt="Naver"
                className="w-12 h-12"
              />
            </button>

            <button
              onClick={() => handleSocialLogin('google')}
              className="hover:opacity-80 transition-opacity"
              title="구글 로그인"
            >
              <img
                src="/images/구글.svg"
                alt="Google"
                className="w-12 h-12"
              />
            </button>
          </div>

          {/* 구분선 */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gray-400"></div>
            <span className="text-sm text-gray-700">또는</span>
            <div className="flex-1 h-px bg-gray-400"></div>
          </div>

          {/* 이메일 로그인 버튼 */}
          <button
            onClick={() => navigate('/login/email')}
            className="w-full bg-black text-white py-3.5 rounded-full font-medium text-sm hover:bg-gray-900 transition-colors shadow-md mb-6"
          >
            이메일로 로그인
          </button>

          {/* 회원가입 & 둘러보기 */}
          <div className="text-center space-y-3">
            <button
              onClick={() => navigate('/signup')}
              className="text-sm text-gray-800 hover:text-gray-900 font-medium"
            >
              회원가입
            </button>
            <div>
              <button
                onClick={handleGuestBrowse}
                className="text-sm text-gray-700 hover:text-gray-900"
              >
                로그인 없이 둘러보기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
