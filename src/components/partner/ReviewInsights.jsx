import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Star, MessageSquare, Smile, ThumbsUp, ThumbsDown, Sparkles, AlertTriangle, TrendingUp, Award } from 'lucide-react';

// 리뷰 인사이트 컴포넌트
export default function ReviewInsights({ analytics }) {
  // analytics가 배열인지 확인
  const analyticsArray = Array.isArray(analytics) ? analytics : [];

  if (analyticsArray.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Star size={20} />
          리뷰 인사이트
        </h2>
        <p className="text-gray-500 text-center py-8">리뷰 데이터가 없습니다</p>
      </div>
    );
  }

  // 평점 추이 데이터
  const ratingTrendData = analyticsArray.map(item => ({
    name: item.event_name?.substring(0, 10) || 'Event',
    평점: item.average_rating || 0,
    리뷰수: item.review_count || 0,
  }));

  // 평균 평점 계산
  const avgRating = analyticsArray.length > 0
    ? (analyticsArray.reduce((sum, a) => sum + (a.average_rating || 0), 0) / analyticsArray.length).toFixed(1)
    : 0;

  // 총 리뷰 수
  const totalReviews = analyticsArray.reduce((sum, a) => sum + (a.review_count || 0), 0);

  // 최신 이벤트의 긍정/부정 키워드
  const latestAnalytics = analyticsArray[0];
  const positiveKeywords = latestAnalytics?.positive_keywords || [];
  const negativeKeywords = latestAnalytics?.negative_keywords || [];

  // 감성 점수
  const sentimentScore = latestAnalytics?.sentiment_score || 0;

  // 감성 분석 데이터 (파이 차트용)
  const sentimentData = [
    { name: '긍정', value: sentimentScore, color: '#ec4899' },
    { name: '부정', value: 100 - sentimentScore, color: '#a855f7' },
  ];

  // 경쟁사 비교 (평균 평점 기준 - 임시 데이터)
  const competitorData = [
    { name: '우리', 평점: parseFloat(avgRating), color: '#ec4899' },
    { name: '업계평균', 평점: 4.2, color: '#a855f7' },
  ];

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Star size={28} />
          리뷰 인사이트
        </h2>
        <p className="text-gray-600">고객 리뷰를 분석하여 인사이트를 제공합니다</p>
      </div>

      {/* 주요 지표 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-pink-50 to-pink-100 border border-pink-200 rounded-lg p-6">
          <div className="flex items-center mb-2">
            <Star className="text-pink-500 fill-pink-500" size={32} />
          </div>
          <div className="text-sm text-gray-600 mb-1">평균 평점</div>
          <div className="text-3xl font-bold text-gray-900">{avgRating} / 5.0</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-6">
          <div className="mb-2">
            <MessageSquare size={32} className="text-gray-700" />
          </div>
          <div className="text-sm text-gray-600 mb-1">총 리뷰 수</div>
          <div className="text-3xl font-bold text-gray-900">{totalReviews}개</div>
        </div>

        <div className="bg-gradient-to-br from-rose-50 to-rose-100 border border-rose-200 rounded-lg p-6">
          <div className="mb-2">
            <Smile size={32} className="text-gray-700" />
          </div>
          <div className="text-sm text-gray-600 mb-1">긍정 감성 점수</div>
          <div className="text-3xl font-bold text-gray-900">{sentimentScore}%</div>
        </div>
      </div>

      {/* 평점 추이 그래프 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold mb-4">평점 추이 (시간에 따른 변화)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={ratingTrendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 5]} />
            <Tooltip
              formatter={(value, name) => [
                name === '평점' ? `${value.toFixed(1)} / 5.0` : `${value}개`,
                name
              ]}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="평점"
              stroke="#ec4899"
              strokeWidth={3}
              dot={{ r: 5, fill: '#ec4899' }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 긍정/부정 키워드 & 감성 분석 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 키워드 분석 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-4">주요 키워드 분석</h3>

          {/* 긍정 키워드 */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-pink-600 mb-2 flex items-center gap-1">
              <ThumbsUp size={16} /> 긍정 키워드
            </h4>
            {positiveKeywords.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {positiveKeywords.slice(0, 10).map((keyword, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium"
                  >
                    {typeof keyword === 'object' ? keyword.word : keyword}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">데이터 없음</p>
            )}
          </div>

          {/* 부정 키워드 */}
          <div>
            <h4 className="text-sm font-semibold text-purple-600 mb-2 flex items-center gap-1">
              <ThumbsDown size={16} /> 개선 필요 키워드
            </h4>
            {negativeKeywords.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {negativeKeywords.slice(0, 10).map((keyword, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                  >
                    {typeof keyword === 'object' ? keyword.word : keyword}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">데이터 없음</p>
            )}
          </div>
        </div>

        {/* 감성 분석 파이 차트 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-4">감성 분석</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={sentimentData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} ${value.toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {sentimentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 p-4 bg-pink-50 rounded">
            <p className="text-sm text-gray-600 flex items-center gap-2">
              {sentimentScore >= 70 ? (
                <>
                  <Sparkles size={16} className="text-pink-500" />
                  매우 긍정적인 리뷰가 많습니다!
                </>
              ) : sentimentScore >= 50 ? (
                <>
                  <Smile size={16} className="text-purple-500" />
                  전반적으로 긍정적인 평가를 받고 있습니다.
                </>
              ) : (
                <>
                  <AlertTriangle size={16} className="text-rose-500" />
                  고객 경험 개선이 필요합니다.
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* 경쟁사 대비 평점 비교 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold mb-4">업계 평균 대비 평점 비교</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={competitorData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="category" dataKey="name" />
            <YAxis type="number" domain={[0, 5]} />
            <Tooltip formatter={(value) => [`${value.toFixed(1)} / 5.0`, '평점']} />
            <Bar dataKey="평점" fill="#8884d8" radius={[8, 8, 0, 0]}>
              {competitorData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 p-4 bg-pink-50 rounded">
          <p className="text-sm text-gray-700 flex items-center gap-2">
            {parseFloat(avgRating) > 4.2 ? (
              <>
                <Award size={16} className="text-pink-500" />
                업계 평균보다 높은 평점을 받고 있습니다!
              </>
            ) : (
              <>
                <TrendingUp size={16} className="text-purple-500" />
                업계 평균에 도달하기 위해 노력이 필요합니다.
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

