import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, DollarSign, Star } from 'lucide-react';

// 실시간 성과 대시보드 컴포넌트
export default function PerformanceDashboard({ analytics }) {
  // analytics가 배열인지 확인
  const analyticsArray = Array.isArray(analytics) ? analytics : [];

  if (analyticsArray.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <TrendingUp size={20} />
          실시간 성과 대시보드
        </h2>
        <p className="text-gray-500 text-center py-8">성과 데이터가 없습니다</p>
      </div>
    );
  }

  // 매출 추이 데이터 (최근 이벤트들)
  const salesTrendData = analyticsArray.map(item => ({
    name: item.event_name?.substring(0, 10) || 'Event',
    매출액: parseFloat(item.estimated_sales) || 0,
    방문객: item.visitor_count || 0,
  }));

  // 시간대별 방문객 데이터 (최신 이벤트 기준)
  const latestAnalytics = analyticsArray[0];
  const hourlyData = latestAnalytics?.hourly_visitors
    ? Object.entries(latestAnalytics.hourly_visitors).map(([hour, count]) => ({
        시간: `${hour}시`,
        방문객수: count,
      }))
    : [];

  // 평균 계산
  const avgVisitors = analyticsArray.length > 0
    ? Math.round(analyticsArray.reduce((sum, a) => sum + (a.visitor_count || 0), 0) / analyticsArray.length)
    : 0;

  const avgSales = analyticsArray.length > 0
    ? Math.round(analyticsArray.reduce((sum, a) => sum + parseFloat(a.estimated_sales || 0), 0) / analyticsArray.length)
    : 0;

  const avgRating = analyticsArray.length > 0
    ? (analyticsArray.reduce((sum, a) => sum + (a.average_rating || 0), 0) / analyticsArray.length).toFixed(1)
    : 0;

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <TrendingUp size={28} />
          실시간 성과 대시보드
        </h2>
        <p className="text-gray-600">이벤트별 성과를 한눈에 확인하세요</p>
      </div>

      {/* 주요 지표 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          icon={Users}
          label="평균 방문객 수"
          value={avgVisitors.toLocaleString()}
          unit="명"
          color="pink"
        />
        <MetricCard
          icon={DollarSign}
          label="평균 매출액"
          value={avgSales.toLocaleString()}
          unit="원"
          color="purple"
        />
        <MetricCard
          icon={Star}
          label="평균 평점"
          value={avgRating}
          unit="/ 5.0"
          color="rose"
        />
      </div>

      {/* 매출 추이 그래프 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold mb-4">이벤트별 매출 및 방문객 추이</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={salesTrendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" orientation="left" stroke="#ec4899" />
            <YAxis yAxisId="right" orientation="right" stroke="#a855f7" />
            <Tooltip
              formatter={(value, name) => [
                name === '매출액' ? `${value.toLocaleString()}원` : `${value}명`,
                name
              ]}
            />
            <Legend />
            <Bar yAxisId="left" dataKey="매출액" fill="#ec4899" />
            <Bar yAxisId="right" dataKey="방문객" fill="#a855f7" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 시간대별 방문객 통계 */}
      {hourlyData.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-4">시간대별 피크 타임 분석</h3>
          <p className="text-sm text-gray-600 mb-4">
            {latestAnalytics?.event_name} - 시간대별 방문객 분포
          </p>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="시간" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}명`, '방문객수']} />
              <Legend />
              <Line
                type="monotone"
                dataKey="방문객수"
                stroke="#ec4899"
                strokeWidth={2}
                dot={{ r: 4, fill: '#ec4899' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-pink-50 rounded p-3">
              <p className="text-sm text-gray-600">피크 타임</p>
              <p className="text-lg font-bold text-pink-600">
                {hourlyData.reduce((max, item) =>
                  item.방문객수 > max.방문객수 ? item : max
                , hourlyData[0])?.시간}
              </p>
            </div>
            <div className="bg-purple-50 rounded p-3">
              <p className="text-sm text-gray-600">최고 방문객</p>
              <p className="text-lg font-bold text-purple-600">
                {Math.max(...hourlyData.map(d => d.방문객수))}명
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 지표 카드 컴포넌트
function MetricCard({ icon: IconComponent, label, value, unit, color }) {
  const colorClasses = {
    pink: 'from-pink-50 to-pink-100 border-pink-200',
    purple: 'from-purple-50 to-purple-100 border-purple-200',
    rose: 'from-rose-50 to-rose-100 border-rose-200',
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} border rounded-lg p-6`}>
      <div className="mb-2">
        <IconComponent size={32} className="text-gray-700" />
      </div>
      <div className="text-sm text-gray-600 mb-1">{label}</div>
      <div className="flex items-baseline">
        <span className="text-3xl font-bold text-gray-900">{value}</span>
        <span className="text-sm text-gray-600 ml-2">{unit}</span>
      </div>
    </div>
  );
}
