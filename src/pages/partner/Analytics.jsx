import { useState, useEffect } from "react";
import { analyticsAPI } from "../../api/partner";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function Analytics() {
  const [analytics, setAnalytics] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnalytics, setSelectedAnalytics] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [analyticsRes, summaryRes] = await Promise.all([
        analyticsAPI.getAnalytics(),
        analyticsAPI.getSummary(),
      ]);
      setAnalytics(analyticsRes.data);
      setSummary(summaryRes.data);
      if (analyticsRes.data.length > 0) {
        setSelectedAnalytics(analyticsRes.data[0]);
      }
    } catch (error) {
      console.error("데이터 로딩 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async (id) => {
    try {
      const response = await analyticsAPI.exportPDF(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `analytics_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("PDF 다운로드 실패:", error);
      alert("PDF 다운로드에 실패했습니다.");
    }
  };

  // 차트 색상
  const COLORS = ["#EC4899", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  if (analytics.length === 0) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">데이터 분석 📈</h1>
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-xl text-gray-600">
            아직 분석할 데이터가 없습니다.
          </p>
          <p className="text-gray-500 mt-2">
            축제 참여 후 성과 데이터가 생성됩니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      {/* 헤더 */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">데이터 분석 📈</h1>
        <p className="text-sm md:text-base text-gray-600">축제 참여 성과를 한눈에 확인하세요</p>
      </div>

      {/* 전체 요약 통계 */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">총 방문객</span>
              <span className="text-2xl">👥</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {summary.total_visitors?.toLocaleString() || 0}
            </div>
            <div className="text-sm text-gray-500 mt-1">명</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">총 매출</span>
              <span className="text-2xl">💰</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {(summary.total_sales / 10000)?.toLocaleString() || 0}
            </div>
            <div className="text-sm text-gray-500 mt-1">만원</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">평균 평점</span>
              <span className="text-2xl">⭐</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {summary.avg_rating?.toFixed(1) || 0}
            </div>
            <div className="text-sm text-gray-500 mt-1">/ 5.0</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">총 리뷰</span>
              <span className="text-2xl">💬</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {summary.total_reviews?.toLocaleString() || 0}
            </div>
            <div className="text-sm text-gray-500 mt-1">개</div>
          </div>
        </div>
      )}

      {/* 축제별 성과 선택 */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          축제별 상세 분석
        </h2>
        <div className="flex gap-3 flex-wrap">
          {analytics.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedAnalytics(item)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedAnalytics?.id === item.id
                  ? "bg-pink-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {item.event_name}
            </button>
          ))}
        </div>
      </div>

      {selectedAnalytics && (
        <>
          {/* 상세 분석 헤더 */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedAnalytics.event_name}
                </h2>
                <p className="text-gray-600 mt-1">
                  {new Date(selectedAnalytics.generated_at).toLocaleDateString(
                    "ko-KR"
                  )}{" "}
                  기준
                </p>
              </div>
              <button
                onClick={() => handleDownloadPDF(selectedAnalytics.id)}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <span>📄</span>
                <span>PDF 다운로드</span>
              </button>
            </div>
          </div>

          {/* 핵심 지표 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                방문객 수
              </h3>
              <div className="text-4xl font-bold text-pink-600">
                {selectedAnalytics.visitor_count?.toLocaleString()}
              </div>
              <p className="text-sm text-gray-500 mt-2">명</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                예상 매출
              </h3>
              <div className="text-4xl font-bold text-green-600">
                {(
                  selectedAnalytics.estimated_sales / 10000
                )?.toLocaleString()}
              </div>
              <p className="text-sm text-gray-500 mt-2">만원</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                고객 평점
              </h3>
              <div className="text-4xl font-bold text-yellow-600">
                {selectedAnalytics.average_rating?.toFixed(1)}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                / 5.0 ({selectedAnalytics.review_count}개 리뷰)
              </p>
            </div>
          </div>

          {/* 차트 영역 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* 인기 제품 TOP 5 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                인기 제품 TOP 5
              </h3>
              {selectedAnalytics.top_products &&
              selectedAnalytics.top_products.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={selectedAnalytics.top_products}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sales" fill="#EC4899" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-500">
                  데이터 없음
                </div>
              )}
            </div>

            {/* 시간대별 방문객 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                시간대별 방문객
              </h3>
              {selectedAnalytics.hourly_visitors &&
              selectedAnalytics.hourly_visitors.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={selectedAnalytics.hourly_visitors}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="visitors"
                      stroke="#10B981"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-500">
                  데이터 없음
                </div>
              )}
            </div>
          </div>

          {/* 리뷰 분석 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 감성 분석 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                고객 만족도
              </h3>
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="text-6xl mb-4">
                    {selectedAnalytics.sentiment_score >= 0.7
                      ? "😊"
                      : selectedAnalytics.sentiment_score >= 0.4
                      ? "😐"
                      : "😞"}
                  </div>
                  <div className="text-3xl font-bold text-gray-900">
                    {(selectedAnalytics.sentiment_score * 100).toFixed(0)}%
                  </div>
                  <p className="text-gray-600 mt-2">긍정적</p>
                </div>
              </div>
            </div>

            {/* 주요 키워드 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                주요 리뷰 키워드
              </h3>
              {selectedAnalytics.review_keywords &&
              selectedAnalytics.review_keywords.length > 0 ? (
                <div className="flex flex-wrap gap-3 p-4">
                  {selectedAnalytics.review_keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-pink-100 text-pink-800 rounded-full text-sm font-medium"
                    >
                      #{keyword}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-500">
                  데이터 없음
                </div>
              )}
            </div>
          </div>

          {/* 인사이트 */}
          {selectedAnalytics.insights && (
            <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg shadow p-6 mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span>💡</span>
                <span>인사이트</span>
              </h3>
              <div className="space-y-3">
                {selectedAnalytics.insights.map((insight, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="text-pink-600">•</span>
                    <p className="text-gray-700">{insight}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Analytics;
