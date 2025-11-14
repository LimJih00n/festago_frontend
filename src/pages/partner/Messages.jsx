import { useState, useEffect } from "react";
import { messageAPI } from "../../api/partner";
import { MessageCircle, Mail, Send } from "lucide-react";

function Messages() {
  const [activeTab, setActiveTab] = useState("inbox"); // inbox, sent
  const [messages, setMessages] = useState([]);
  const [inboxCount, setInboxCount] = useState(0);
  const [sentCount, setSentCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showCompose, setShowCompose] = useState(false);
  const [replyTo, setReplyTo] = useState(null);

  // 메시지 작성 폼
  const [composeForm, setComposeForm] = useState({
    receiver: "",
    subject: "",
    content: "",
    application: null,
  });

  useEffect(() => {
    loadMessages();
  }, [activeTab]);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const [inboxRes, sentRes, countRes] = await Promise.all([
        messageAPI.getInbox(),
        messageAPI.getSent(),
        messageAPI.getUnreadCount(),
      ]);

      // API 응답이 배열인지 확인
      const inboxData = Array.isArray(inboxRes.data)
        ? inboxRes.data
        : (inboxRes.data.results || []);
      const sentData = Array.isArray(sentRes.data)
        ? sentRes.data
        : (sentRes.data.results || []);

      setInboxCount(inboxData.length);
      setSentCount(sentData.length);
      setUnreadCount(countRes.data.unread_count || 0);

      // 현재 탭에 따라 메시지 설정
      setMessages(activeTab === "inbox" ? inboxData : sentData);
    } catch (error) {
      console.error("메시지 로딩 실패:", error);
      setMessages([]);  // 에러 시 빈 배열로 설정
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await messageAPI.markAsRead(id);
      loadMessages();
    } catch (error) {
      console.error("읽음 처리 실패:", error);
    }
  };

  const handleReply = (message) => {
    setReplyTo(message);
    setComposeForm({
      receiver: message.sender,
      subject: `Re: ${message.subject}`,
      content: `\n\n---\n원본 메시지:\n${message.content}`,
      application: message.application,
    });
    setShowCompose(true);
  };

  const handleSendMessage = async () => {
    if (!composeForm.subject || !composeForm.content) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    try {
      await messageAPI.sendMessage({
        receiver: composeForm.receiver,
        subject: composeForm.subject,
        content: composeForm.content,
        application: composeForm.application,
      });
      alert("메시지가 전송되었습니다!");
      setShowCompose(false);
      setReplyTo(null);
      setComposeForm({
        receiver: "",
        subject: "",
        content: "",
        application: null,
      });
      loadMessages();
    } catch (error) {
      console.error("메시지 전송 실패:", error);
      alert("메시지 전송에 실패했습니다.");
    }
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

  return (
    <div className="p-4 md:p-8">
      {/* 헤더 */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <MessageCircle className="w-8 h-8" />
            메시지
          </h1>
          <p className="text-gray-500">읽지 않은 메시지: {unreadCount}개</p>
        </div>
        <button
          onClick={() => {
            setReplyTo(null);
            setComposeForm({
              receiver: "",
              subject: "",
              content: "",
              application: null,
            });
            setShowCompose(true);
          }}
          className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors flex items-center gap-2"
        >
          <Mail size={20} />
          새 메시지
        </button>
      </div>

      {/* 탭 */}
      <div className="flex gap-2 mb-6 border-b">
        <button
          onClick={() => setActiveTab("inbox")}
          className={`px-6 py-3 font-medium ${
            activeTab === "inbox"
              ? "text-pink-600 border-b-2 border-pink-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          받은편지함 ({inboxCount})
        </button>
        <button
          onClick={() => setActiveTab("sent")}
          className={`px-6 py-3 font-medium ${
            activeTab === "sent"
              ? "text-pink-600 border-b-2 border-pink-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          보낸편지함 ({sentCount})
        </button>
      </div>

      {/* 메시지 목록 */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
        </div>
      ) : messages.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-xl text-gray-600">
            {activeTab === "inbox"
              ? "받은 메시지가 없습니다"
              : "보낸 메시지가 없습니다"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-md transition-shadow ${
                !msg.read && activeTab === "inbox"
                  ? "border-l-4 border-pink-600"
                  : ""
              }`}
              onClick={() => {
                setSelectedMessage(msg);
                if (!msg.read && activeTab === "inbox") {
                  handleMarkAsRead(msg.id);
                }
              }}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg">{msg.subject}</h3>
                    {!msg.read && activeTab === "inbox" && (
                      <span className="px-2 py-1 bg-pink-100 text-pink-800 text-xs rounded-full font-semibold">
                        NEW
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {activeTab === "inbox"
                      ? `보낸이: ${msg.sender_info?.username || "알 수 없음"}`
                      : `받는이: ${msg.receiver_info?.username || "알 수 없음"}`}
                  </p>
                </div>
                <span className="text-sm text-gray-500">
                  {getTimeAgo(msg.created_at)}
                </span>
              </div>
              <p className="text-gray-700 line-clamp-2">{msg.content}</p>
              {msg.application && (
                <div className="mt-3 text-sm text-pink-600">
                  📋 지원서 관련
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 메시지 상세 모달 */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedMessage.subject}
                </h2>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div>
                  <p>
                    {activeTab === "inbox" ? "보낸이" : "받는이"}:{" "}
                    {activeTab === "inbox"
                      ? selectedMessage.sender_info?.username
                      : selectedMessage.receiver_info?.username}
                  </p>
                  <p className="text-gray-500">
                    {new Date(selectedMessage.created_at).toLocaleString(
                      "ko-KR"
                    )}
                  </p>
                </div>
                {activeTab === "inbox" && (
                  <button
                    onClick={() => {
                      handleReply(selectedMessage);
                      setSelectedMessage(null);
                    }}
                    className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                  >
                    답장하기
                  </button>
                )}
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-800 whitespace-pre-wrap">
                {selectedMessage.content}
              </p>
              {selectedMessage.application && (
                <div className="mt-6 p-4 bg-pink-50 rounded-lg">
                  <p className="text-sm text-pink-800">
                    📋 이 메시지는 지원서와 관련된 메시지입니다.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 메시지 작성 모달 */}
      {showCompose && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {replyTo ? "답장 보내기" : "새 메시지"}
                </h2>
                <button
                  onClick={() => {
                    setShowCompose(false);
                    setReplyTo(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {!replyTo && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    받는이 (User ID)
                  </label>
                  <input
                    type="text"
                    value={composeForm.receiver}
                    onChange={(e) =>
                      setComposeForm({ ...composeForm, receiver: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    placeholder="받는이 ID"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  제목
                </label>
                <input
                  type="text"
                  value={composeForm.subject}
                  onChange={(e) =>
                    setComposeForm({ ...composeForm, subject: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  placeholder="제목을 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  내용
                </label>
                <textarea
                  value={composeForm.content}
                  onChange={(e) =>
                    setComposeForm({ ...composeForm, content: e.target.value })
                  }
                  rows={10}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  placeholder="메시지 내용을 입력하세요"
                />
              </div>
            </div>
            <div className="p-6 border-t flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowCompose(false);
                  setReplyTo(null);
                }}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleSendMessage}
                className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
              >
                전송하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Messages;
