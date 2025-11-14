import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Sparkles, MapPin, Calendar, User } from 'lucide-react';

export default function MobileTabBar() {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    {
      id: 'home',
      label: '홈',
      icon: Home,
      path: '/',
    },
    {
      id: 'ai',
      label: 'AI추천',
      icon: Sparkles,
      path: '/chatbot',
    },
    {
      id: 'map',
      label: '지도',
      icon: MapPin,
      path: '/map',
      isCenter: true, // 가운데 강조
    },
    {
      id: 'calendar',
      label: '캘린더',
      icon: Calendar,
      path: '/calendar',
    },
    {
      id: 'profile',
      label: '마이',
      icon: User,
      path: '/profile',
    },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom z-50">
      <div className="flex items-center justify-around px-2 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.path);
          const isCenter = tab.isCenter;

          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-all
                ${isCenter ? 'min-w-[70px]' : 'min-w-[60px]'}
                ${active ? 'text-pink-500' : 'text-gray-500'}
              `}
            >
              {isCenter ? (
                // 가운데 지도 아이콘 - 원형 배경으로 강조
                <div className={`flex items-center justify-center w-12 h-12 rounded-full transition-colors mb-1
                  ${active ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-600'}
                `}>
                  <Icon
                    size={28}
                    className="stroke-2"
                  />
                </div>
              ) : (
                <Icon
                  size={24}
                  className={active ? 'stroke-2' : 'stroke-1.5'}
                />
              )}
              <span className={`text-xs mt-1 font-medium ${active ? 'font-semibold' : ''} ${isCenter ? 'text-[10px]' : ''}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
