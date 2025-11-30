import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MobileHeader from '../components/mobile/MobileHeader';
import api from '../api/axios';

export default function ChatbotPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '안녕하세요! 저는 축제 추천 AI 페스타고예요! 🎉\n\n어떤 축제나 행사를 찾고 계신가요? 자유롭게 물어봐주세요!\n\n예를 들어:\n• "서울에서 이번 주말에 가볼만한 곳 추천해줘"\n• "데이트하기 좋은 전시회 있을까?"\n• "가족이랑 갈만한 축제 알려줘"',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // 추천 질문 버튼
  const suggestedQuestions = [
    '이번 주말 서울에서 뭐하지?',
    '데이트하기 좋은 곳 추천해줘',
    '무료로 즐길 수 있는 행사 있어?',
    '가족이랑 갈만한 축제 알려줘',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 메시지 추가
  const addMessage = (role, content, recommendations = null) => {
    setMessages((prev) => [
      ...prev,
      {
        role,
        content,
        timestamp: new Date(),
        recommendations,
      },
    ]);
  };

  // GPT API 호출
  const sendToGPT = async (userMessage) => {
    setIsTyping(true);

    try {
      // 대화 히스토리 구성 (최근 10개만)
      const chatHistory = messages.slice(-10).map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      // 사용자 메시지 추가
      chatHistory.push({
        role: 'user',
        content: userMessage,
      });

      // API 호출
      const response = await api.post('/api/chatbot/', {
        messages: chatHistory,
      });

      const { message, recommendations } = response.data;

      // 응답 추가
      addMessage('assistant', message, recommendations);
    } catch (error) {
      console.error('챗봇 오류:', error);

      let errorMessage = '죄송해요, 일시적인 오류가 발생했어요. 다시 시도해주세요! 😅';

      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }

      addMessage('assistant', errorMessage);
    } finally {
      setIsTyping(false);
    }
  };

  // 사용자 메시지 전송
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMsg = inputMessage.trim();
    addMessage('user', userMsg);
    setInputMessage('');

    await sendToGPT(userMsg);
  };

  // 대화 초기화
  const handleReset = () => {
    setMessages([
      {
        role: 'assistant',
        content: '안녕하세요! 저는 축제 추천 AI 페스타고예요! 🎉\n\n어떤 축제나 행사를 찾고 계신가요? 자유롭게 물어봐주세요!',
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <MobileHeader showMenu={false} showNotification={false} />

      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="text-pink-500" size={24} />
          <h1 className="text-lg font-bold text-gray-900">AI 축제 추천</h1>
        </div>
        <button
          onClick={handleReset}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          title="대화 초기화"
        >
          <RefreshCw size={20} />
        </button>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-24 space-y-4">
        {messages.map((msg, index) => (
          <div key={index}>
            {/* 메시지 버블 */}
            <div
              className={`flex ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-pink-500 text-white'
                    : 'bg-white text-gray-900 shadow-sm'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    msg.role === 'user' ? 'text-pink-100' : 'text-gray-400'
                  }`}
                >
                  {msg.timestamp.toLocaleTimeString('ko-KR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>

            {/* 추천 카드 */}
            {msg.recommendations && msg.recommendations.length > 0 && (
              <div className="mt-3 space-y-3">
                {msg.recommendations.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => navigate(`/events/${event.id}`)}
                    className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                  >
                    <div className="flex">
                      <div className="w-24 h-24 flex-shrink-0 bg-gradient-to-br from-pink-100 to-pink-200">
                        {event.poster_image ? (
                          <img
                            src={event.poster_image}
                            alt={event.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-3xl">
                            🎪
                          </div>
                        )}
                      </div>
                      <div className="flex-1 p-3">
                        <div className="flex items-start justify-between">
                          <h4 className="font-bold text-sm text-gray-900 line-clamp-2 mb-1 flex-1">
                            {event.name}
                          </h4>
                          <span className="text-xs bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full ml-2 flex-shrink-0">
                            {event.category === 'festival' && '축제'}
                            {event.category === 'concert' && '공연'}
                            {event.category === 'exhibition' && '전시'}
                            {event.category === 'popup' && '팝업'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mb-1">
                          📍 {event.location}
                        </p>
                        {event.start_date && (
                          <p className="text-xs text-gray-500">
                            📅 {event.start_date} ~ {event.end_date}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* 타이핑 인디케이터 */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl px-4 py-3 shadow-sm">
              <div className="flex gap-1 items-center">
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0.2s' }}
                ></div>
                <div
                  className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0.4s' }}
                ></div>
                <span className="ml-2 text-xs text-gray-400">생각 중...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 추천 질문 (처음에만 표시) */}
      {messages.length === 1 && (
        <div className="px-4 pb-4">
          <p className="text-xs text-gray-500 mb-2">이런 질문을 해보세요:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => {
                  addMessage('user', q);
                  sendToGPT(q);
                }}
                className="text-xs bg-white border border-pink-200 text-pink-600 px-3 py-1.5 rounded-full hover:bg-pink-50 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 입력 영역 */}
      <div className="bg-white border-t border-gray-200 px-4 py-3 pb-20">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="축제에 대해 무엇이든 물어보세요..."
            disabled={isTyping}
            className="flex-1 px-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm disabled:opacity-50"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="p-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
