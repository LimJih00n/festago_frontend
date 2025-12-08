import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import HomePage from './pages/HomePage';
import EventListPage from './pages/EventListPage';
import EventDetailPage from './pages/EventDetailPage';
import MapPage from './pages/MapPage';
import ChatbotPage from './pages/ChatbotPage';
import CalendarPage from './pages/CalendarPage';
import ReviewPage from './pages/ReviewPage';
import ReviewWritePage from './pages/ReviewWritePage';
import ProfilePage from './pages/ProfilePage';
import SearchPage from './pages/SearchPage';
import ProfileEditPage from './pages/ProfileEditPage';
import LoginPage from './pages/LoginPage';
import LoginCallbackPage from './pages/LoginCallbackPage';
import PartnerLoginPage from './pages/PartnerLoginPage';
import EmailLoginPage from './pages/EmailLoginPage';
import SignupPage from './pages/SignupPage';
import PartnerSignupPage from './pages/PartnerSignupPage';
import MobileTabBar from './components/mobile/MobileTabBar';

// 사업자 페이지
import PartnerSidebar from './components/partner/PartnerSidebar';
import MobilePartnerNav from './components/partner/MobilePartnerNav';
import MobileHeader from './components/partner/MobileHeader';
import PartnerDashboard from './pages/partner/PartnerDashboard';
import FestivalBrowse from './pages/partner/FestivalBrowse';
import MyApplications from './pages/partner/MyApplications';
import PartnerProfile from './pages/partner/PartnerProfile';
import Messages from './pages/partner/Messages';
import Analytics from './pages/partner/Analytics';
import Notifications from './pages/partner/Notifications';
import ApplicationForm from './pages/partner/ApplicationForm';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Routes>
          {/* 일반 유저 영역 */}
          <Route path="/" element={<ConsumerLayout />}>
            <Route index element={<HomePage />} />
            <Route path="events" element={<EventListPage />} />
            <Route path="events/:id" element={<EventDetailPage />} />
            <Route path="events/:id/reviews" element={<ReviewPage />} />
            <Route path="events/:id/reviews/write" element={<ReviewWritePage />} />
            <Route path="map" element={<MapPage />} />
            <Route path="chatbot" element={<ChatbotPage />} />
            <Route path="bookmarks" element={<ComingSoon title="찜" />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="profile/edit" element={<ProfileEditPage />} />
            <Route path="search" element={<SearchPage />} />
          </Route>

          {/* 로그인/회원가입 */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/login/callback" element={<LoginCallbackPage />} />
          <Route path="/login/partner" element={<PartnerLoginPage />} />
          <Route path="/login/email" element={<EmailLoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/signup/partner" element={<PartnerSignupPage />} />
          <Route path="/find-password" element={<ComingSoon title="비밀번호 찾기" />} />

          {/* 사업자 영역 */}
          <Route path="/partner" element={<PartnerLayout />}>
            <Route index element={<PartnerDashboard />} />
            <Route path="dashboard" element={<PartnerDashboard />} />
            <Route path="festivals" element={<FestivalBrowse />} />
            <Route path="festivals/:eventId/apply" element={<ApplicationForm />} />
            <Route path="applications" element={<MyApplications />} />
            <Route path="profile" element={<PartnerProfile />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="messages" element={<Messages />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>

          {/* 404 - 등록되지 않은 모든 경로 */}
          <Route path="*" element={<ComingSoon title="페이지 준비 중" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

// 일반 유저 레이아웃 (하단 탭바)
function ConsumerLayout() {
  return (
    <>
      <Outlet />
      <MobileTabBar />
    </>
  );
}

// 사업자 레이아웃 (사이드바 + 모바일 탭바)
function PartnerLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <PartnerSidebar />
      <div className="flex-1 flex flex-col">
        <MobileHeader />
        <main className="flex-1 overflow-auto pb-16 md:pb-0">
          <Outlet />
        </main>
      </div>
      <MobilePartnerNav />
    </div>
  );
}

// 임시 Coming Soon 페이지
function ComingSoon({ title }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="text-6xl mb-4">🚧</div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">{title}</h1>
      <p className="text-gray-500">곧 만나요!</p>
    </div>
  );
}

export default App;
