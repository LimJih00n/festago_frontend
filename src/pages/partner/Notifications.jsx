import { useState, useEffect } from "react";
import { notificationAPI } from "../../api/partner";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, unread, read
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const { data } = await notificationAPI.getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error("알림 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      loadNotifications();
    } catch (error) {
      console.error("알림 읽음 처리 실패:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      loadNotifications();
    } catch (error) {
      console.error("전체 읽음 처리 실패:", error);
    }
  };

  const getTypeEmoji = (type) => {
    const emojiMap = {
      application_submitted: "📝",
      application_approved: "✅",
      application_rejected: "❌",
      message_received: "💬",
      event_reminder: "📅",
      payment_required: "💳",
      booth_assigned: "🏪",
      analytics_ready: "📊",
      system: "🔔",
    };
    return emojiMap[type] || "🔔";
  };

  const getTypeLabel = (type) => {
    const labelMap = {
      application_submitted: "지원서 제출",
      application_approved: "지원 승인",
      application_rejected: "지원 거절",
      message_received: "새 메시지",
      event_reminder: "이벤트 알림",
      payment_required: "결제 필요",
      booth_assigned: "부스 배정",
      analytics_ready: "성과 데이터",
      system: "시스템",
    };
    return labelMap[type] || "알림";
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return "방금 전";
    if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}일 전`;
    return date.toLocaleDateString("ko-KR");
  };

  // 필터링된 알림 목록
  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "unread" && notif.read) return false;
    if (filter === "read" && !notif.read) return false;
    if (typeFilter !== "all" && notif.notification_type !== typeFilter)
      return false;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const notificationTypes = [
    { value: "all", label: "전체" },
    { value: "application_submitted", label: "지원서 제출" },
    { value: "application_approved", label: "지원 승인" },
    { value: "application_rejected", label: "지원 거절" },
    { value: "message_received", label: "새 메시지" },
    { value: "event_reminder", label: "이벤트 알림" },
    { value: "payment_required", label: "결제 필요" },
    { value: "booth_assigned", label: "부스 배정" },
    { value: "analytics_ready", label: "성과 데이터" },
    { value: "system", label: "시스템" },
  ];

  return (
    <div className="p-4 md:p-8">
      {/* 헤더 */}
      <div className="mb-4 md:mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">알림</h1>
            <p className="text-gray-600 mt-1">
              읽지 않은 알림 <span className="font-semibold">{unreadCount}</span>
              개
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
            >
              전체 읽음 처리
            </button>
          )}
        </div>

        {/* 필터 */}
        <div className="flex gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg ${
                filter === "all"
                  ? "bg-pink-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              전체
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-4 py-2 rounded-lg ${
                filter === "unread"
                  ? "bg-pink-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              읽지 않음
            </button>
            <button
              onClick={() => setFilter("read")}
              className={`px-4 py-2 rounded-lg ${
                filter === "read"
                  ? "bg-pink-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              읽음
            </button>
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          >
            {notificationTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 알림 목록 */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">로딩 중...</p>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-6xl mb-4">🔔</p>
          <p className="text-xl text-gray-600">
            {filter === "unread"
              ? "읽지 않은 알림이 없습니다"
              : filter === "read"
              ? "읽은 알림이 없습니다"
              : "알림이 없습니다"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`bg-white rounded-lg shadow p-6 transition-all hover:shadow-md cursor-pointer ${
                !notif.read ? "border-l-4 border-pink-600" : ""
              }`}
              onClick={() => !notif.read && handleMarkAsRead(notif.id)}
            >
              <div className="flex items-start gap-4">
                {/* 아이콘 */}
                <div className="flex-shrink-0">
                  <span className="text-4xl">
                    {getTypeEmoji(notif.notification_type)}
                  </span>
                </div>

                {/* 내용 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {notif.title}
                      </h3>
                      {!notif.read && (
                        <span className="px-2 py-1 text-xs font-semibold text-pink-600 bg-pink-100 rounded-full">
                          NEW
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">
                      {getTimeAgo(notif.created_at)}
                    </span>
                  </div>

                  <p className="text-gray-700 mb-2">{notif.message}</p>

                  <div className="flex items-center gap-4 text-sm">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded">
                      {getTypeLabel(notif.notification_type)}
                    </span>
                    {notif.link && (
                      <a
                        href={notif.link}
                        className="text-pink-600 hover:text-pink-800 font-medium"
                        onClick={(e) => e.stopPropagation()}
                      >
                        자세히 보기 →
                      </a>
                    )}
                  </div>
                </div>

                {/* 읽음 표시 */}
                {notif.read && (
                  <div className="flex-shrink-0">
                    <span className="text-gray-400 text-sm">✓ 읽음</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notifications;
