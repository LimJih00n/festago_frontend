import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Tent, ClipboardList, Building2, MessageCircle, Home } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';

function PartnerSidebar() {
  const location = useLocation();

  const menuItems = [
    { path: '/partner/dashboard', icon: LayoutDashboard, label: '대시보드' },
    { path: '/partner/festivals', icon: Tent, label: '축제 탐색' },
    { path: '/partner/applications', icon: ClipboardList, label: '내 지원 내역' },
    { path: '/partner/messages', icon: MessageCircle, label: '메시지' },
    { path: '/partner/profile', icon: Building2, label: '프로필 관리' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="hidden md:block w-64 bg-white border-r border-gray-200 min-h-screen">
      {/* 로고 & 알림 */}
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <Link to="/partner/dashboard" className="flex items-center space-x-3">
          <img src="/images/logo.svg" alt="Logo" className="w-9 h-9" />
          <img src="/images/FESTAGO.svg" alt="FESTAGO" className="h-7" />
        </Link>
        <NotificationDropdown />
      </div>

      {/* 메뉴 */}
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-pink-50 text-pink-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <IconComponent size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* 하단 */}
      <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200">
        <Link
          to="/"
          className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900"
        >
          <Home size={20} />
          <span>일반 페이지로</span>
        </Link>
      </div>
    </aside>
  );
}

export default PartnerSidebar;
