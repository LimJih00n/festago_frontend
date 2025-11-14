import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Tent, ClipboardList, MessageCircle, Building2 } from 'lucide-react';

function MobilePartnerNav() {
  const location = useLocation();

  const menuItems = [
    { path: '/partner/dashboard', icon: LayoutDashboard, label: '대시보드' },
    { path: '/partner/festivals', icon: Tent, label: '축제' },
    { path: '/partner/applications', icon: ClipboardList, label: '지원' },
    { path: '/partner/messages', icon: MessageCircle, label: '메시지' },
    { path: '/partner/profile', icon: Building2, label: '프로필' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <div className="flex justify-around items-center h-16">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full ${
                isActive(item.path)
                  ? 'text-pink-600'
                  : 'text-gray-600'
              }`}
            >
              <IconComponent size={24} className="mb-1" />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default MobilePartnerNav;
