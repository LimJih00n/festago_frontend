import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { MapPin, Calendar as CalendarIcon } from 'lucide-react';
import { getEvents } from '../api/events';
import MobileHeader from '../components/mobile/MobileHeader';

export default function CalendarPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [eventsOnDate, setEventsOnDate] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    // 선택된 날짜의 이벤트 필터링
    if (selectedDate) {
      filterEventsByDate(selectedDate);
    }
  }, [selectedDate, events]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await getEvents({ page_size: 200 });
      setEvents(response.data.results || response.data);
    } catch (err) {
      console.error('이벤트 로딩 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterEventsByDate = (date) => {
    const dateStr = formatDateToYYYYMMDD(date);
    const filtered = events.filter((event) => {
      return dateStr >= event.start_date && dateStr <= event.end_date;
    });
    setEventsOnDate(filtered);
  };

  const formatDateToYYYYMMDD = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 해당 날짜에 이벤트가 있는지 확인
  const hasEventOnDate = (date) => {
    const dateStr = formatDateToYYYYMMDD(date);
    return events.some((event) => {
      return dateStr >= event.start_date && dateStr <= event.end_date;
    });
  };

  // 캘린더 타일에 점 표시
  const tileContent = ({ date, view }) => {
    if (view === 'month' && hasEventOnDate(date)) {
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

  const handleEventClick = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  const categoryLabels = {
    festival: '축제',
    concert: '공연',
    exhibition: '전시',
    popup: '팝업스토어',
  };

  const categoryEmojis = {
    festival: '🎉',
    concert: '🎵',
    exhibition: '🎨',
    popup: '🛍️',
  };

  if (loading) {
    return (
      <>
        <MobileHeader title="캘린더" showNotification={false} />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent mb-4"></div>
            <p className="text-gray-600">로딩 중...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <MobileHeader title="캘린더" showNotification={false} />

      {/* Calendar Section */}
      <div className="px-4 pt-4">
        <div className="mobile-card overflow-hidden">
          <div className="calendar-container">
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
      </div>

      {/* Selected Date Info */}
      <div className="px-4 mt-4">
        <div className="flex items-center gap-2 mb-3">
          <CalendarIcon size={20} className="text-pink-500" />
          <h2 className="text-lg font-bold text-gray-900">
            {selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월{' '}
            {selectedDate.getDate()}일
          </h2>
        </div>

        {/* Events List */}
        {eventsOnDate.length > 0 ? (
          <div className="space-y-3">
            {eventsOnDate.map((event) => (
              <div
                key={event.id}
                onClick={() => handleEventClick(event.id)}
                className="mobile-card cursor-pointer active:scale-[0.98] transition-transform"
              >
                <div className="flex gap-3 p-4">
                  {/* Event Image */}
                  <div className="relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-pink-100 to-pink-200">
                    <img
                      src={event.poster_image}
                      alt={event.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {/* Category Badge */}
                    <div className="absolute top-1 left-1">
                      <span className="text-xs">
                        {categoryEmojis[event.category]}
                      </span>
                    </div>
                  </div>

                  {/* Event Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 line-clamp-1 text-sm">
                        {event.name}
                      </h3>
                      <span className="flex-shrink-0 text-xs px-2 py-0.5 bg-pink-100 text-pink-600 rounded-full font-medium">
                        {categoryLabels[event.category]}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                      <MapPin size={12} />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <CalendarIcon size={12} />
                      <span>
                        {event.start_date} ~ {event.end_date}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mobile-card">
            <div className="p-8 text-center">
              <div className="text-4xl mb-3">📅</div>
              <p className="text-gray-500">이 날짜에 진행중인 축제가 없습니다.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
