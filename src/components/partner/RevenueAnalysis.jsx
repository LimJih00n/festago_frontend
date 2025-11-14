import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, Banknote, CreditCard, Gem, BarChart3, Lightbulb, Sparkles, TrendingUp, AlertTriangle } from 'lucide-react';

// 수익 분석 컴포넌트
export default function RevenueAnalysis({ analytics, applications }) {
  // analytics와 applications가 배열인지 확인
  const analyticsArray = Array.isArray(analytics) ? analytics : [];
  const applicationsArray = Array.isArray(applications) ? applications : [];

  if (analyticsArray.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <DollarSign size={20} />
          수익 분석
        </h2>
        <p className="text-gray-500 text-center py-8">수익 데이터가 없습니다</p>
      </div>
    );
  }

  // 총 예상 매출액
  const totalSales = analyticsArray.reduce((sum, a) => sum + parseFloat(a.estimated_sales || 0), 0);

  // 총 참가비
  const totalFees = applicationsArray.reduce((sum, app) =>
    sum + parseFloat(app.participation_fee || 0), 0
  , 0);

  // 순수익 (매출 - 참가비)
  const netProfit = totalSales - totalFees;

  // ROI 계산 ((순수익 / 투자금액) * 100)
  const roi = totalFees > 0 ? ((netProfit / totalFees) * 100).toFixed(1) : 0;

  // 이벤트별 수익 데이터
  const revenueByEventData = analyticsArray.map((item, idx) => {
    const app = applicationsArray.find(a => a.event === item.event) || {};
    const sales = parseFloat(item.estimated_sales || 0);
    const fee = parseFloat(app.participation_fee || 0);
    const profit = sales - fee;

    return {
      name: item.event_name?.substring(0, 10) || `Event ${idx + 1}`,
      매출: sales,
      참가비: fee,
      순수익: profit,
    };
  });

  // 수익률 분포 (파이 차트용)
  const profitDistribution = [
    { name: '매출', value: totalSales, color: '#ec4899' },
    { name: '참가비', value: totalFees, color: '#a855f7' },
  ];

  // 평균 매출
  const avgSales = analyticsArray.length > 0
    ? Math.round(totalSales / analyticsArray.length)
    : 0;

  // 최고 수익 이벤트
  const bestEvent = revenueByEventData.length > 0
    ? revenueByEventData.reduce((max, item) =>
        item.순수익 > max.순수익 ? item : max
      )
    : { name: '-', 순수익: 0 };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <DollarSign size={28} />
          수익 분석
        </h2>
        <p className="text-gray-600">이벤트별 수익을 분석하고 ROI를 확인하세요</p>
      </div>

      {/* 주요 수익 지표 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <RevenueMetricCard
          icon={Banknote}
          label="총 예상 매출액"
          value={totalSales.toLocaleString()}
          unit="원"
          color="pink"
        />
        <RevenueMetricCard
          icon={CreditCard}
          label="총 참가비"
          value={totalFees.toLocaleString()}
          unit="원"
          color="purple"
        />
        <RevenueMetricCard
          icon={Gem}
          label="순수익"
          value={netProfit.toLocaleString()}
          unit="원"
          color="rose"
          highlight={netProfit > 0}
        />
        <RevenueMetricCard
          icon={BarChart3}
          label="ROI"
          value={roi}
          unit="%"
          color="fuchsia"
          highlight={roi > 0}
        />
      </div>

      {/* 이벤트별 수익 비교 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold mb-4">이벤트별 수익 비교</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={revenueByEventData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              formatter={(value) => [`${value.toLocaleString()}원`]}
            />
            <Legend />
            <Bar dataKey="매출" fill="#ec4899" />
            <Bar dataKey="참가비" fill="#a855f7" />
            <Bar dataKey="순수익" fill="#f472b6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 매출 대비 참가비 비율 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-4">매출 구성 비율</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={profitDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value.toLocaleString()}원`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {profitDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value.toLocaleString()}원`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 p-4 bg-pink-50 rounded">
            <p className="text-sm text-gray-600">
              참가비 대비 매출 비율: <strong>{totalFees > 0 ? ((totalSales / totalFees) * 100).toFixed(0) : 0}%</strong>
            </p>
          </div>
        </div>

        {/* ROI 상세 분석 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-4">ROI 상세 분석</h3>

          {/* ROI 게이지 */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">투자 수익률 (ROI)</span>
              <span className={`text-2xl font-bold ${roi > 0 ? 'text-pink-600' : 'text-purple-600'}`}>
                {roi}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className={`h-4 rounded-full ${roi > 0 ? 'bg-pink-500' : 'bg-purple-400'}`}
                style={{ width: `${Math.min(Math.abs(roi), 100)}%` }}
              ></div>
            </div>
          </div>

          {/* 상세 정보 */}
          <div className="space-y-3">
            <div className="flex justify-between p-3 bg-pink-50 rounded">
              <span className="text-sm text-gray-600">평균 이벤트 매출</span>
              <span className="font-semibold text-gray-900">{avgSales.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between p-3 bg-purple-50 rounded">
              <span className="text-sm text-gray-600">최고 수익 이벤트</span>
              <span className="font-semibold text-gray-900">{bestEvent.name}</span>
            </div>
            <div className="flex justify-between p-3 bg-rose-50 rounded">
              <span className="text-sm text-gray-600">최고 수익 금액</span>
              <span className="font-semibold text-gray-900">{bestEvent.순수익.toLocaleString()}원</span>
            </div>
          </div>

          {/* 조언 */}
          <div className="mt-4 p-4 bg-pink-50 border border-pink-200 rounded">
            <p className="text-sm text-pink-800 flex items-center gap-2">
              {roi > 200 ? (
                <>
                  <Sparkles size={16} className="text-pink-600" />
                  매우 높은 ROI! 현재 전략을 유지하세요.
                </>
              ) : roi > 100 ? (
                <>
                  <TrendingUp size={16} className="text-pink-600" />
                  좋은 ROI입니다. 추가 성장 기회를 모색하세요.
                </>
              ) : roi > 0 ? (
                <>
                  <TrendingUp size={16} className="text-purple-600" />
                  긍정적인 수익입니다. 비용 효율을 더 높여보세요.
                </>
              ) : (
                <>
                  <AlertTriangle size={16} className="text-rose-600" />
                  수익 개선이 필요합니다. 비용 구조를 검토하세요.
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* 참가비 대비 ROI 계산 설명 */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-6">
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
          <Lightbulb size={20} />
          ROI 계산 방법
        </h3>
        <div className="space-y-2 text-sm text-gray-700">
          <p><strong>ROI (투자 수익률)</strong> = (순수익 ÷ 참가비) × 100</p>
          <p>• 순수익 = 총 매출액 - 총 참가비</p>
          <p>• ROI가 100% 이상이면 투자 대비 수익이 발생한 것입니다</p>
          <p>• ROI가 높을수록 효율적인 투자입니다</p>
        </div>
      </div>
    </div>
  );
}

// 수익 지표 카드 컴포넌트
function RevenueMetricCard({ icon: IconComponent, label, value, unit, color, highlight = false }) {
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
      <div className="text-xs text-gray-600 mb-2 whitespace-normal break-words leading-tight">{label}</div>
      <div className="flex items-baseline flex-wrap">
        <span className="text-xl font-bold text-gray-900">
          {value}
        </span>
        <span className="text-xs text-gray-600 ml-1">{unit}</span>
      </div>
    </div>
  );
}
