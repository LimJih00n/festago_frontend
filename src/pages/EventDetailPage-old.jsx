import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getEvent } from '../api/events';

export default function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const response = await getEvent(id);
      setEvent(response.data);
      setError(null);
    } catch (err) {
      setError('데이터를 불러오는데 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">로딩 중...</div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-500">{error || '이벤트를 찾을 수 없습니다.'}</div>
      </div>
    );
  }

  const categoryLabels = {
    festival: '축제',
    concert: '공연',
    exhibition: '전시',
    popup: '팝업스토어',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link to="/" className="text-blue-600 hover:underline">
            ← 돌아가기
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Poster Image */}
          <img
            src={event.poster_image}
            alt={event.name}
            className="w-full h-96 object-cover"
          />

          {/* Event Info */}
          <div className="p-8">
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {categoryLabels[event.category] || event.category}
              </span>
            </div>

            <h1 className="text-4xl font-bold mb-4">{event.name}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-gray-700">
              <div>
                <span className="font-semibold">📍 위치:</span> {event.location}
              </div>
              <div>
                <span className="font-semibold">📅 기간:</span> {event.start_date} ~ {event.end_date}
              </div>
              {event.address && (
                <div className="md:col-span-2">
                  <span className="font-semibold">🏠 주소:</span> {event.address}
                </div>
              )}
            </div>

            <div className="border-t pt-6 mb-6">
              <h2 className="text-2xl font-semibold mb-4">상세 설명</h2>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {event.description}
              </p>
            </div>

            {event.website_url && (
              <div className="border-t pt-6">
                <a
                  href={event.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  공식 웹사이트 방문 →
                </a>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
