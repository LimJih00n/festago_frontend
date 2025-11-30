import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowLeft, Clock, TrendingUp } from 'lucide-react';
import { getEvents } from '../api/events';

export default function SearchPage() {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showResults, setShowResults] = useState(false);

  // 인기 검색어 (하드코딩)
  const popularSearches = ['크리스마스', '팝업스토어', '전시회', '콘서트', '서울'];

  // 최근 검색어 로드
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
    // 자동 포커스
    inputRef.current?.focus();
  }, []);

  // 검색어 저장
  const saveSearch = (term) => {
    if (!term.trim()) return;
    const updated = [term, ...recentSearches.filter((s) => s !== term)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  // 검색 실행
  const handleSearch = async (searchTerm = query) => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    setShowResults(true);
    saveSearch(searchTerm);

    try {
      const response = await getEvents({ search: searchTerm, page_size: 50 });
      setResults(response.data.results || response.data);
    } catch (err) {
      console.error('검색 오류:', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // 검색어 클리어
  const clearQuery = () => {
    setQuery('');
    setShowResults(false);
    setResults([]);
    inputRef.current?.focus();
  };

  // 최근 검색어 삭제
  const removeRecentSearch = (term) => {
    const updated = recentSearches.filter((s) => s !== term);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  // 최근 검색어 전체 삭제
  const clearAllRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  // 카테고리 라벨
  const getCategoryLabel = (category) => {
    const labels = {
      festival: '축제',
      concert: '공연',
      exhibition: '전시',
      popup: '팝업',
    };
    return labels[category] || category;
  };

  // 카테고리 색상
  const getCategoryColor = (category) => {
    const colors = {
      festival: 'bg-pink-500',
      concert: 'bg-purple-500',
      exhibition: 'bg-blue-500',
      popup: 'bg-green-500',
    };
    return colors[category] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 검색 헤더 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center gap-2 px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 active:scale-95 transition-transform"
          >
            <ArrowLeft size={24} className="text-gray-700" />
          </button>

          <div className="flex-1 relative">
            <Search
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="축제, 전시, 공연 검색..."
              className="w-full pl-10 pr-10 py-2.5 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm"
            />
            {query && (
              <button
                onClick={clearQuery}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1"
              >
                <X size={18} className="text-gray-400" />
              </button>
            )}
          </div>

          <button
            onClick={() => handleSearch()}
            className="px-4 py-2 bg-pink-500 text-white text-sm font-medium rounded-full hover:bg-pink-600 transition-colors"
          >
            검색
          </button>
        </div>
      </header>

      {/* 검색 결과 */}
      {showResults ? (
        <div className="px-4 py-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-pink-500 border-t-transparent"></div>
            </div>
          ) : results.length > 0 ? (
            <>
              <p className="text-sm text-gray-500 mb-4">
                검색 결과 {results.length}개
              </p>
              <div className="space-y-3">
                {results.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => navigate(`/events/${event.id}`)}
                    className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <div className="flex">
                      <div className="w-24 h-24 flex-shrink-0 bg-gray-100">
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
                        <div className="flex items-start gap-2 mb-1">
                          <h3 className="font-bold text-sm text-gray-900 line-clamp-2 flex-1">
                            {event.name}
                          </h3>
                          <span
                            className={`${getCategoryColor(
                              event.category
                            )} text-white text-xs px-2 py-0.5 rounded-full flex-shrink-0`}
                          >
                            {getCategoryLabel(event.category)}
                          </span>
                        </div>
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
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-gray-500 mb-2">
                "{query}"에 대한 검색 결과가 없습니다.
              </p>
              <p className="text-sm text-gray-400">
                다른 검색어를 입력해보세요.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="px-4 py-4">
          {/* 최근 검색어 */}
          {recentSearches.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1">
                  <Clock size={16} />
                  최근 검색어
                </h3>
                <button
                  onClick={clearAllRecentSearches}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  전체 삭제
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1 bg-white border border-gray-200 rounded-full px-3 py-1.5"
                  >
                    <button
                      onClick={() => {
                        setQuery(term);
                        handleSearch(term);
                      }}
                      className="text-sm text-gray-700"
                    >
                      {term}
                    </button>
                    <button
                      onClick={() => removeRecentSearch(term)}
                      className="p-0.5 hover:bg-gray-100 rounded-full"
                    >
                      <X size={14} className="text-gray-400" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 인기 검색어 */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1 mb-3">
              <TrendingUp size={16} className="text-pink-500" />
              인기 검색어
            </h3>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((term, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuery(term);
                    handleSearch(term);
                  }}
                  className="bg-pink-50 text-pink-600 text-sm px-4 py-2 rounded-full hover:bg-pink-100 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
