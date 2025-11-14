import { useState, useEffect } from "react";
import { applicationAPI } from "../../api/partner";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { ClipboardList, Calendar as CalendarIcon, List } from "lucide-react";

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [viewMode, setViewMode] = useState("list"); // list, calendar
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appsOnDate, setAppsOnDate] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedDate && viewMode === "calendar") {
      filterAppsByDate(selectedDate);
    }
  }, [selectedDate, applications, filter]);

  const loadData = async () => {
    try {
      const [appsRes, statsRes] = await Promise.all([
        applicationAPI.getMyApplications(),
        applicationAPI.getStats(),
      ]);
      // API 응답이 배열인지 확인
      const appsData = Array.isArray(appsRes.data) ? appsRes.data : (appsRes.data.results || []);
      setApplications(appsData);
      setStats(statsRes.data);
    } catch (error) {
      console.error("데이터 로딩 실패:", error);
      setApplications([]);  // 에러 시 빈 배열로 설정
    } finally {
      setLoading(false);
    }
  };

  const filteredApps = applications.filter((app) => {
    if (filter === "all") return true;
    return app.status === filter;
  });

  const getStatusBadge = (status) => {
    const badges = {
      pending: { text: "검토중", color: "bg-yellow-100 text-yellow-800" },
      approved: { text: "승인됨", color: "bg-green-100 text-green-800" },
      rejected: { text: "거절됨", color: "bg-red-100 text-red-800" },
      completed: { text: "완료", color: "bg-pink-100 text-pink-800" },
    };
    const badge = badges[status] || badges.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-sm ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  // 캘린더 관련 함수
  const formatDateToYYYYMMDD = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const filterAppsByDate = (date) => {
    const dateStr = formatDateToYYYYMMDD(date);
    const filtered = filteredApps.filter((app) => {
      return dateStr >= app.event_info.start_date && dateStr <= app.event_info.end_date;
    });
    setAppsOnDate(filtered);
  };

  // 해당 날짜에 축제가 진행중인지 확인 (기간 포함)
  const hasEventOnDate = (date) => {
    const dateStr = formatDateToYYYYMMDD(date);
    return filteredApps.some((app) => {
      return dateStr >= app.event_info.start_date && dateStr <= app.event_info.end_date;
    });
  };

  // 해당 날짜의 이벤트들을 상태별로 그룹화
  const getEventsStatusOnDate = (date) => {
    const dateStr = formatDateToYYYYMMDD(date);
    const appsOnThisDate = filteredApps.filter((app) => {
      return dateStr >= app.event_info.start_date && dateStr <= app.event_info.end_date;
    });

    const statuses = {
      approved: false,
      pending: false,
      rejected: false,
      completed: false,
    };

    appsOnThisDate.forEach((app) => {
      statuses[app.status] = true;
    });

    return statuses;
  };

  // 캘린더 타일에 색상 점 표시
  const tileContent = ({ date, view }) => {
    if (view === "month" && hasEventOnDate(date)) {
      return (
        <div className="flex justify-center">
          <div className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-1"></div>
        </div>
      );
    }
    return null;
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  if (loading) {
    return <div className="p-8 text-center">로딩중...</div>;
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <ClipboardList className="w-8 h-8" />
          내 지원 내역
        </h1>
        <p className="text-gray-500">지원한 축제를 관리하세요</p>
      </div>

      {/* 뷰 모드 탭 */}
      <div className="flex gap-2 mb-6 border-b">
        <button
          onClick={() => setViewMode("list")}
          className={`px-6 py-3 font-medium flex items-center gap-2 ${
            viewMode === "list"
              ? "text-pink-600 border-b-2 border-pink-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <List size={20} />
          리스트 보기
        </button>
        <button
          onClick={() => setViewMode("calendar")}
          className={`px-6 py-3 font-medium flex items-center gap-2 ${
            viewMode === "calendar"
              ? "text-pink-600 border-b-2 border-pink-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <CalendarIcon size={20} />
          캘린더 보기
        </button>
      </div>

      {stats && (
        <div className="mb-8 space-y-4">
          {/* 전체 - 큰 박스 */}
          <button
            onClick={() => setFilter("all")}
            className={`w-full p-6 rounded-lg border-2 transition-colors ${
              filter === "all"
                ? "border-pink-500 bg-pink-50"
                : "border-gray-200 bg-white hover:border-pink-300"
            }`}
          >
            <div className="text-4xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-lg text-gray-600 mt-2">전체 지원</div>
          </button>

          {/* 나머지 4개 - 4분할 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatBox label="대기중" value={stats.pending} onClick={() => setFilter("pending")} active={filter === "pending"} />
            <StatBox label="승인됨" value={stats.approved} onClick={() => setFilter("approved")} active={filter === "approved"} />
            <StatBox label="거절됨" value={stats.rejected} onClick={() => setFilter("rejected")} active={filter === "rejected"} />
            <StatBox label="완료" value={stats.completed} onClick={() => setFilter("completed")} active={filter === "completed"} />
          </div>
        </div>
      )}

      {/* 리스트 뷰 */}
      {viewMode === "list" && (
        <div className="space-y-4">
        {filteredApps.map((app) => (
          <div key={app.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{app.event_info.name}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {app.event_info.location} • {app.event_info.start_date}
                </p>
              </div>
              {getStatusBadge(app.status)}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-500">부스 종류:</span>
                <span className="ml-2 font-medium">{app.booth_type_display}</span>
              </div>
              <div>
                <span className="text-gray-500">부스 크기:</span>
                <span className="ml-2 font-medium">{app.booth_size_display}</span>
              </div>
              <div>
                <span className="text-gray-500">참가비:</span>
                <span className="ml-2 font-medium">{Number(app.participation_fee).toLocaleString()}원</span>
              </div>
              <div>
                <span className="text-gray-500">지원일:</span>
                <span className="ml-2 font-medium">{new Date(app.applied_at).toLocaleDateString("ko-KR")}</span>
              </div>
            </div>

            {app.organizer_message && (
              <div className="mt-4 p-4 bg-pink-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">주최자 메시지:</span> {app.organizer_message}
                </p>
              </div>
            )}

            {app.rejection_reason && (
              <div className="mt-4 p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">거절 사유:</span> {app.rejection_reason}
                </p>
              </div>
            )}
          </div>
        ))}

        {filteredApps.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            지원 내역이 없습니다
          </div>
        )}
        </div>
      )}

      {/* 캘린더 뷰 */}
      {viewMode === "calendar" && (
        <>
          {/* 캘린더 */}
          <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
            <div className="calendar-container p-4">
              <Calendar
                onChange={handleDateChange}
                value={selectedDate}
                locale="ko-KR"
                tileContent={tileContent}
                className="w-full border-none"
                formatDay={(locale, date) => date.getDate()}
                prev2Label={null}
                next2Label={null}
              />
            </div>
          </div>

          {/* 선택된 날짜의 지원 내역 */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              📅 {selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월{" "}
              {selectedDate.getDate()}일
            </h3>

            {appsOnDate.length > 0 ? (
              <div className="space-y-4">
                {appsOnDate.map((app) => (
                  <div key={app.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {app.event_info.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {app.event_info.location} • {app.event_info.start_date} ~{" "}
                          {app.event_info.end_date}
                        </p>
                      </div>
                      {getStatusBadge(app.status)}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">부스 종류:</span>
                        <span className="ml-2 font-medium">
                          {app.booth_type_display}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">부스 크기:</span>
                        <span className="ml-2 font-medium">
                          {app.booth_size_display}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">참가비:</span>
                        <span className="ml-2 font-medium">
                          {Number(app.participation_fee).toLocaleString()}원
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">지원일:</span>
                        <span className="ml-2 font-medium">
                          {new Date(app.applied_at).toLocaleDateString("ko-KR")}
                        </span>
                      </div>
                    </div>

                    {app.organizer_message && (
                      <div className="mt-4 p-4 bg-pink-50 rounded-lg">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">주최자 메시지:</span>{" "}
                          {app.organizer_message}
                        </p>
                      </div>
                    )}

                    {app.rejection_reason && (
                      <div className="mt-4 p-4 bg-red-50 rounded-lg">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">거절 사유:</span>{" "}
                          {app.rejection_reason}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <div className="text-6xl mb-4">📅</div>
                <p className="text-xl text-gray-600">
                  이 날짜에 진행중인 축제가 없습니다.
                </p>
              </div>
            )}
          </div>

          {/* 범례 */}
          <div className="bg-white rounded-lg shadow p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">상태 표시</h4>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-700">검토중</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">승인됨</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-gray-700">거절됨</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                <span className="text-gray-700">완료</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              * 캘린더의 점은 축제가 진행되는 모든 기간에 표시됩니다
            </p>
          </div>
        </>
      )}
    </div>
  );
}

function StatBox({ label, value, onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-lg border-2 transition-colors ${
        active
          ? "border-pink-500 bg-pink-50"
          : "border-gray-200 bg-white hover:border-pink-300"
      }`}
    >
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-sm text-gray-600 mt-1">{label}</div>
    </button>
  );
}

export default MyApplications;
