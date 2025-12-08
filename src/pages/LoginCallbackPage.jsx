import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function LoginCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState(null);

  useEffect(() => {
    const accessToken = searchParams.get('access');
    const refreshToken = searchParams.get('refresh');
    const errorMessage = searchParams.get('error');

    if (errorMessage) {
      setError(errorMessage);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      return;
    }

    if (accessToken && refreshToken) {
      // 토큰 저장
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);

      // 홈으로 이동
      navigate('/');
    } else {
      setError('로그인 처리 중 오류가 발생했습니다.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
  }, [searchParams, navigate]);

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-pink-200 via-pink-300 to-pink-200 flex flex-col items-center justify-center">
      {error ? (
        <div className="text-center">
          <div className="text-6xl mb-4">😢</div>
          <p className="text-lg text-gray-800">{error}</p>
          <p className="text-sm text-gray-600 mt-2">로그인 페이지로 이동합니다...</p>
        </div>
      ) : (
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-pink-500 mb-4 mx-auto"></div>
          <p className="text-lg text-gray-800">로그인 처리 중...</p>
        </div>
      )}
    </div>
  );
}
