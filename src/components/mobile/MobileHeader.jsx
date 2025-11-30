import { ArrowLeft, Bell, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MobileHeader({
  title = '페스타고',
  showBackButton = false,
  showNotification = false,
  showMenu = false,
  showLogo = true
}) {
  const navigate = useNavigate();

  return (
    <header className="
      sticky top-0
      bg-white border-b border-gray-200
      z-40
      safe-area-inset-top
    ">
      <div className="flex items-center justify-between h-14 px-4 max-w-screen-xl mx-auto">
        {/* 왼쪽 */}
        <div className="flex items-center">
          {showBackButton ? (
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 active:scale-95 transition-transform"
            >
              <ArrowLeft size={24} className="text-gray-700" />
            </button>
          ) : showMenu ? (
            <button className="p-2 -ml-2 active:scale-95 transition-transform">
              <Menu size={24} className="text-gray-700" />
            </button>
          ) : null}
        </div>

        {/* 중앙 타이틀 또는 로고 */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2">
          {showLogo ? (
            <>
              <img
                src="/images/logo.svg"
                alt="Festago Logo"
                className="h-8 w-8"
              />
              <img
                src="/images/FESTAGO.svg"
                alt="FESTAGO"
                className="h-6"
              />
            </>
          ) : (
            <h1 className="text-lg font-bold text-gray-900">
              {title}
            </h1>
          )}
        </div>

        {/* 오른쪽 */}
        <div className="flex items-center">
          {showNotification && (
            <button className="p-2 -mr-2 relative active:scale-95 transition-transform">
              <Bell size={24} className="text-gray-700" />
              {/* 알림 뱃지 */}
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
