import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MobileHeader from '../components/mobile/MobileHeader';
import { getEvents } from '../api/events';

export default function ChatbotPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '안녕하세요! 🎉\n어떤 축제를 찾고 계신가요?',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [questionStep, setQuestionStep] = useState(0);
  const [userPreferences, setUserPreferences] = useState({});
  const messagesEndRef = useRef(null);

  // 추천 질문 버튼
  const suggestedQuestions = [
    '오늘 근처에서 하는 축제 알려줘',
    '이번 주말 무료 축제가 있을까?',
    '당일치기 축제 추천해줘',
    '사진 찍기 좋은 곳 있어?',
  ];

  // 챗봇 질문 플로우
  const questionFlow = [
    {
      question: '어떤 종류의 행사를 선호하시나요?',
      options: ['축제', '공연', '전시', '팝업스토어'],
      key: 'category',
    },
    {
      question: '어느 지역의 행사를 찾으시나요?',
      options: ['서울', '부산', '경기', '상관없어요'],
      key: 'location',
    },
    {
      question: '언제 방문하고 싶으신가요?',
      options: ['이번 주말', '다음 주', '이번 달', '언제든'],
      key: 'when',
    },
    {
      question: '누구와 함께 가시나요?',
      options: ['혼자', '친구', '연인', '가족'],
      key: 'companion',
    },
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

  // 사용자 선택 처리
  const handleOptionSelect = async (option) => {
    const currentQuestion = questionFlow[questionStep];

    // 사용자 선택 저장
    addMessage('user', option);
    setUserPreferences((prev) => ({
      ...prev,
      [currentQuestion.key]: option,
    }));

    setIsTyping(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsTyping(false);

    // 다음 질문 또는 추천
    if (questionStep < questionFlow.length - 1) {
      setQuestionStep(questionStep + 1);
      addMessage('assistant', questionFlow[questionStep + 1].question);
    } else {
      // 모든 질문 완료 - 축제 추천
      await recommendEvents({
        ...userPreferences,
        [currentQuestion.key]: option,
      });
    }
  };

  // 축제 추천
  const recommendEvents = async (preferences) => {
    setIsTyping(true);

    try {
      // 이벤트 데이터 가져오기
      const response = await getEvents();
      const allEvents = response.data.results || response.data;

      // 필터링
      let filtered = allEvents;

      // 카테고리 필터
      if (preferences.category && preferences.category !== '상관없어요') {
        const categoryMap = {
          축제: 'festival',
          공연: 'concert',
          전시: 'exhibition',
          팝업스토어: 'popup',
        };
        filtered = filtered.filter(
          (e) => e.category === categoryMap[preferences.category]
        );
      }

      // 지역 필터
      if (preferences.location && preferences.location !== '상관없어요') {
        filtered = filtered.filter((e) =>
          e.location.includes(preferences.location)
        );
      }

      // 랜덤하게 4개 선택
      const shuffled = [...filtered].sort(() => Math.random() - 0.5);
      const recommendations = shuffled.slice(0, 4);

      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsTyping(false);

      if (recommendations.length > 0) {
        addMessage(
          'assistant',
          `${preferences.companion || '당신'}을 위한 맞춤 추천이에요! 🎊\n아래 축제들을 확인해보세요:`,
          recommendations
        );
      } else {
        addMessage(
          'assistant',
          '죄송해요, 조건에 맞는 축제를 찾지 못했어요. 😢\n다른 조건으로 다시 검색해볼까요?'
        );
        setQuestionStep(0);
        setUserPreferences({});
      }
    } catch (error) {
      console.error('추천 실패:', error);
      setIsTyping(false);
      addMessage(
        'assistant',
        '추천 중 오류가 발생했어요. 다시 시도해주세요.'
      );
    }
  };

  // 사용자 메시지 전송
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMsg = inputMessage.trim();
    addMessage('user', userMsg);
    setInputMessage('');

    setIsTyping(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsTyping(false);

    // 간단한 응답 생성
    if (questionStep < questionFlow.length) {
      addMessage('assistant', questionFlow[questionStep].question);
    } else {
      addMessage(
        'assistant',
        '위의 버튼을 눌러 질문에 답변해주시면 맞춤 축제를 추천해드릴게요!'
      );
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <MobileHeader showMenu={false} showNotification={false} />

      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-2">
        <Sparkles className="text-pink-500" size={24} />
        <h1 className="text-lg font-bold text-gray-900">AI 축제 추천</h1>
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
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-pink-500 text-white'
                    : 'bg-white text-gray-900 shadow-sm'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
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

            {/* 옵션 버튼 (어시스턴트 메시지 후) */}
            {msg.role === 'assistant' &&
              index === messages.length - 1 &&
              questionStep < questionFlow.length &&
              !isTyping && (
                <div className="flex flex-wrap gap-2 mt-3 ml-2">
                  {questionFlow[questionStep].options.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleOptionSelect(option)}
                      className="px-4 py-2 bg-white border border-pink-200 text-pink-600 rounded-full text-sm font-medium hover:bg-pink-50 transition-colors"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}

            {/* 추천 카드 */}
            {msg.recommendations && (
              <div className="mt-3 space-y-3">
                {msg.recommendations.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => navigate(`/events/${event.id}`)}
                    className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                  >
                    <div className="flex">
                      <div className="w-24 h-24 flex-shrink-0 bg-gradient-to-br from-pink-100 to-pink-200">
                        <img
                          src={event.poster_image}
                          alt={event.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 p-3">
                        <h4 className="font-bold text-sm text-gray-900 line-clamp-2 mb-1">
                          {event.name}
                        </h4>
                        <p className="text-xs text-gray-500 mb-1">
                          📍 {event.location}
                        </p>
                        <p className="text-xs text-gray-500">
                          📅 {event.start_date} ~ {event.end_date}
                        </p>
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
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0.2s' }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0.4s' }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 추천 질문 (처음에만 표시) */}
      {messages.length === 1 && (
        <div className="px-4 pb-4">
          <p className="text-xs text-gray-500 mb-2">추천 질문:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputMessage(q);
                }}
                className="text-xs bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded-full hover:bg-gray-50"
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
            placeholder="메시지를 입력하세요..."
            className="flex-1 px-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className="p-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
