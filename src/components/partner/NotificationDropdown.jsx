import { useState, useEffect } from "react";
import { notificationAPI } from "../../api/partner";
import { useNavigate } from "react-router-dom";

function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadUnreadCount();
    // 30초마다 개수 업데이트
    const interval = setInterval(loadUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  const loadUnreadCount = async () => {
    try {
      const { data } = await notificationAPI.getUnreadCount();
      setUnreadCount(data.unread_count);
    } catch (error) {
      console.error("알림 개수 조회 실패:", error);
    }
  };

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const { data } = await notificationAPI.getUnread();
      setNotifications(data.slice(0, 5)); // 최근 5개만
    } catch (error) {
      console.error("알림 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id, link) => {
    try {
      await notificationAPI.markAsRead(id);
      loadUnreadCount();
      loadNotifications();

      // 링크가 있으면 이동
      if (link) {
        navigate(link);
      }
    } catch (error) {
      console.error("알림 읽음 처리 실패:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      loadUnreadCount();
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

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diff = Math.floor((now - date) / 1000); // 초 단위

    if (diff < 60) return "방금 전";
    if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}일 전`;
    return date.toLocaleDateString("ko-KR");
  };

  return (
    <div className="relative">
      {/* 알림 아이콘 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {/* 뱃지 */}
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* 드롭다운 */}
      {isOpen && (
        <>
          {/* 배경 오버레이 */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* 드롭다운 컨텐츠 */}
          <div className="absolute right-0 z-20 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200">
            {/* 헤더 */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-bold text-gray-900">알림</h3>
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-sm text-pink-600 hover:text-pink-800"
                  >
                    전체 읽음
                  </button>
                )}
                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/partner/notifications");
                  }}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  전체보기
                </button>
              </div>
            </div>

            {/* 알림 목록 */}
            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center text-gray-500">
                  로딩중...
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <p className="text-4xl mb-2">🔔</p>
                  <p>새로운 알림이 없습니다</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => handleMarkAsRead(notif.id, notif.link)}
                    className="p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl flex-shrink-0">
                        {getTypeEmoji(notif.notification_type)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm">
                          {notif.title}
                        </p>
                        <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                          {notif.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {getTimeAgo(notif.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* 푸터 */}
            {notifications.length > 0 && (
              <div className="p-3 border-t text-center">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/partner/notifications");
                  }}
                  className="text-sm text-pink-600 hover:text-pink-800 font-medium"
                >
                  모든 알림 보기 →
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default NotificationDropdown;
