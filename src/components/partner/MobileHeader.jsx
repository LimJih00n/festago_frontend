import { Link } from 'react-router-dom';
import NotificationDropdown from './NotificationDropdown';

function MobileHeader() {
  return (
    <header className="md:hidden sticky top-0 z-30 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between p-4">
        <Link to="/partner/dashboard" className="flex items-center gap-2">
          <img src="/images/logo.svg" alt="Logo" className="w-8 h-8" />
          <img src="/images/FESTAGO.svg" alt="FESTAGO" className="h-5" />
        </Link>
        <NotificationDropdown />
      </div>
    </header>
  );
}

export default MobileHeader;
