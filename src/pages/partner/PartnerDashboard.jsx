import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, TrendingUp, Star, DollarSign, FileText, CheckCircle, Trophy, Bell, Calendar } from 'lucide-react';
import { dashboardAPI, analyticsAPI, applicationAPI } from '../../api/partner';
import PerformanceDashboard from '../../components/partner/PerformanceDashboard';
import ReviewInsights from '../../components/partner/ReviewInsights';
import RevenueAnalysis from '../../components/partner/RevenueAnalysis';

function PartnerDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [analytics, setAnalytics] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'performance', 'reviews', 'revenue'

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [dashboardRes, analyticsRes, appsRes] = await Promise.all([
        dashboardAPI.getDashboard(),
        analyticsAPI.getAnalytics(),
        applicationAPI.getMyApplications(),
      ]);
      setDashboard(dashboardRes.data);
      // DRF pagination: {count, next, previous, results}
      setAnalytics(analyticsRes.data?.results || analyticsRes.data || []);
      setApplications(appsRes.data?.results || appsRes.data || []);
    } catch (error) {
      console.error('데이터 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">로딩중...</div>
      </div>
    );
  }

  // 탭 정의
  const tabs = [
    { id: 'overview', label: '개요', icon: BarChart3 },
    { id: 'performance', label: '실시간 성과', icon: TrendingUp },
    { id: 'reviews', label: '리뷰 인사이트', icon: Star },
    { id: 'revenue', label: '수익 분석', icon: DollarSign },
  ];

  return (
    <div className="p-8">
      {/* 헤더 */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
        <p className="text-gray-500 mt-2">안녕하세요! 한눈에 현황을 확인하세요.</p>
      </div>

      {/* 탭 네비게이션 */}
      <div className="mb-6">
        <div className="grid grid-cols-2 md:flex md:space-x-4 gap-2 md:gap-0 md:border-b md:border-gray-200">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`md:pb-4 md:px-2 px-3 py-3 md:py-0 rounded-lg md:rounded-none font-semibold text-sm transition-colors flex items-center justify-center md:justify-start gap-1 ${
                  activeTab === tab.id
                    ? 'text-pink-600 md:border-b-2 md:border-pink-600 bg-pink-50 md:bg-transparent'
                    : 'text-gray-500 hover:text-gray-700 bg-gray-50 md:bg-transparent hover:bg-gray-100 md:hover:bg-transparent'
                }`}
              >
                <IconComponent size={16} className="flex-shrink-0" />
                <span className="text-xs md:text-sm">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 탭 콘텐츠 */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* 헤더 */}
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <BarChart3 size={28} />
              개요
            </h2>
            <p className="text-gray-600">한눈에 현황을 확인하세요</p>
          </div>

          {/* 통계 카드 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={FileText}
          label="지원 중"
          value={dashboard?.stats?.pending || 0}
          color="pink"
        />
        <StatCard
          icon={CheckCircle}
          label="승인됨"
          value={dashboard?.stats?.approved || 0}
          color="purple"
        />
        <StatCard
          icon={Trophy}
          label="완료"
          value={dashboard?.stats?.completed || 0}
          color="rose"
        />
        <StatCard
          icon={BarChart3}
          label="전체"
          value={dashboard?.stats?.total || 0}
          color="fuchsia"
        />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 최근 알림 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Bell size={20} />
            최근 알림
          </h2>
          {dashboard?.notifications?.length > 0 ? (
            <ul className="space-y-3">
              {dashboard.notifications.map((notif, idx) => (
                <li key={idx} className="border-l-4 border-pink-500 pl-4 py-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {notif.type === 'message' && '💬'}
                        {notif.type === 'approval' && '✅'}
                        {notif.type === 'rejection' && '❌'}
                        {' '}{notif.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notif.created_at).toLocaleString('ko-KR')}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center py-8">새로운 알림이 없습니다</p>
          )}
        </div>

        {/* 다가오는 일정 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Calendar size={20} />
            다가오는 일정
          </h2>
          {dashboard?.upcoming_events?.length > 0 ? (
            <ul className="space-y-3">
              {dashboard.upcoming_events.map((event) => (
                <li key={event.id} className="border-l-4 border-green-500 pl-4 py-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{event.name}</p>
                      <p className="text-sm text-gray-600">{event.location}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {event.date} (D-{event.d_day})
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center py-8">예정된 일정이 없습니다</p>
          )}
        </div>
      </div>

        </div>
      )}

      {/* 실시간 성과 대시보드 탭 */}
      {activeTab === 'performance' && (
        <PerformanceDashboard analytics={analytics} />
      )}

      {/* 리뷰 인사이트 탭 */}
      {activeTab === 'reviews' && (
        <ReviewInsights analytics={analytics} />
      )}

      {/* 수익 분석 탭 */}
      {activeTab === 'revenue' && (
        <RevenueAnalysis analytics={analytics} applications={applications} />
      )}
    </div>
  );
}

// 통계 카드 컴포넌트
function StatCard({ icon: IconComponent, label, value, color }) {
  const colorClasses = {
    pink: 'from-pink-50 to-pink-100 border-pink-200',
    purple: 'from-purple-50 to-purple-100 border-purple-200',
    rose: 'from-rose-50 to-rose-100 border-rose-200',
    fuchsia: 'from-fuchsia-50 to-fuchsia-100 border-fuchsia-200',
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} border rounded-lg p-4`}>
      <div className="mb-2">
        <IconComponent size={24} className="text-gray-700" />
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}건</div>
      <div className="text-xs text-gray-600 mt-1">{label}</div>
    </div>
  );
}

export default PartnerDashboard;
