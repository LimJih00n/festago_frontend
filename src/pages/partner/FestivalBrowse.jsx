import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { partnerFestivalAPI, bookmarkAPI } from "../../api/partner";
import {
  Search,
  Bot,
  UtensilsCrossed,
  ShoppingBag,
  Palette,
  Sparkles,
  Building,
  Home,
  Waves,
  Globe,
  DollarSign,
  Wallet,
  Gem,
  PartyPopper,
  Music,
  Tent,
  MapPin,
  Calendar,
  Heart,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

function FestivalBrowse() {
  const [festivals, setFestivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [viewMode, setViewMode] = useState("search"); // search, ai
  const navigate = useNavigate();

  // AI 추천 관련 state
  const [aiStep, setAiStep] = useState(0);
  const [aiAnswers, setAiAnswers] = useState({
    boothType: "",
    region: "",
    budget: "",
    festivalType: "",
  });
  const [recommendedFestivals, setRecommendedFestivals] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    loadFestivals();
    loadBookmarks();
  }, []);

  const loadFestivals = async () => {
    try {
      console.log("축제 로딩 시작...");
      const response = await partnerFestivalAPI.getFestivals({ search });
      console.log("API 응답:", response.data);
      setFestivals(response.data.results || []);
      console.log("축제 개수:", response.data.results?.length);
    } catch (error) {
      console.error("축제 로딩 실패:", error);
      console.error("에러 상세:", error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const loadBookmarks = async () => {
    try {
      const { data } = await bookmarkAPI.getBookmarks();
      // DRF pagination 처리: {count, next, previous, results}
      const bookmarks = data?.results || data || [];
      const ids = new Set(bookmarks.map((b) => b.event));
      setBookmarkedIds(ids);
    } catch (error) {
      console.log("북마크 로딩 실패 (로그인 필요):", error.response?.status);
      // 로그인하지 않은 경우 무시
      setBookmarkedIds(new Set());
    }
  };

  const handleSearch = () => {
    setLoading(true);
    loadFestivals();
  };

  const handleBookmarkToggle = async (eventId, e) => {
    e.stopPropagation();
    try {
      await bookmarkAPI.toggle(eventId);
      // 북마크 상태 토글
      setBookmarkedIds((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(eventId)) {
          newSet.delete(eventId);
        } else {
          newSet.add(eventId);
        }
        return newSet;
      });
    } catch (error) {
      console.error("북마크 토글 실패:", error);
      alert("북마크 처리에 실패했습니다.");
    }
  };

  // AI 추천 로직
  const aiQuestions = [
    {
      question: "어떤 부스를 운영하시나요?",
      options: [
        { value: "food", label: "음식/음료", icon: UtensilsCrossed },
        { value: "goods", label: "굿즈/기념품", icon: ShoppingBag },
        { value: "experience", label: "체험 부스", icon: Palette },
        { value: "etc", label: "기타", icon: Sparkles },
      ],
      key: "boothType",
    },
    {
      question: "선호하는 지역은 어디인가요?",
      options: [
        { value: "서울", label: "서울", icon: Building },
        { value: "경기", label: "경기", icon: Home },
        { value: "인천", label: "인천", icon: Waves },
        { value: "전국", label: "전국 어디든 좋아요", icon: Globe },
      ],
      key: "region",
    },
    {
      question: "참가비 예산은 어느 정도인가요?",
      options: [
        { value: "low", label: "~30만원", icon: DollarSign },
        { value: "medium", label: "30~100만원", icon: Wallet },
        { value: "high", label: "100만원 이상", icon: Gem },
        { value: "any", label: "상관없음", icon: Sparkles },
      ],
      key: "budget",
    },
    {
      question: "어떤 축제에 참여하고 싶으신가요?",
      options: [
        { value: "festival", label: "전통 축제", icon: PartyPopper },
        { value: "concert", label: "음악 페스티벌", icon: Music },
        { value: "exhibition", label: "전시/박람회", icon: Palette },
        { value: "popup", label: "팝업스토어", icon: ShoppingBag },
      ],
      key: "festivalType",
    },
  ];

  const handleAiAnswer = (value) => {
    const currentQuestion = aiQuestions[aiStep];
    setAiAnswers({
      ...aiAnswers,
      [currentQuestion.key]: value,
    });

    if (aiStep < aiQuestions.length - 1) {
      setAiStep(aiStep + 1);
    } else {
      // 마지막 질문 답변 후 추천 결과 생성
      generateRecommendations({ ...aiAnswers, [currentQuestion.key]: value });
    }
  };

  const generateRecommendations = async (answers) => {
    setAiLoading(true);

    // AI가 분석하는 것처럼 약간의 딜레이
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // 간단한 필터링 로직
    let filtered = [...festivals];

    // 지역 필터
    if (answers.region !== "전국") {
      filtered = filtered.filter((f) => f.location.includes(answers.region));
    }

    // 카테고리 필터
    if (answers.festivalType) {
      filtered = filtered.filter((f) => f.category === answers.festivalType);
    }

    // 예산 필터 (참가비 정보가 있다면)
    // 현재는 예산 필터는 간단히 구현

    // 결과가 없으면 전체 축제 보여주기
    if (filtered.length === 0) {
      filtered = festivals.slice(0, 6);
    } else {
      filtered = filtered.slice(0, 6);
    }

    setRecommendedFestivals(filtered);
    setAiStep(aiQuestions.length); // 완료 상태
    setAiLoading(false);
  };

  const resetAiRecommendation = () => {
    setAiStep(0);
    setAiAnswers({
      boothType: "",
      region: "",
      budget: "",
      festivalType: "",
    });
    setRecommendedFestivals([]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Tent className="w-8 h-8" />
          축제 탐색
        </h1>
        <p className="text-sm md:text-base text-gray-500">참여하고 싶은 축제를 찾아보세요</p>
      </div>

      {/* 탭 */}
      <div className="flex gap-2 mb-6 border-b">
        <button
          onClick={() => {
            setViewMode("search");
            resetAiRecommendation();
          }}
          className={`px-6 py-3 font-medium flex items-center gap-2 ${
            viewMode === "search"
              ? "text-pink-600 border-b-2 border-pink-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Search size={20} />
          검색
        </button>
        <button
          onClick={() => setViewMode("ai")}
          className={`px-6 py-3 font-medium flex items-center gap-2 ${
            viewMode === "ai"
              ? "text-pink-600 border-b-2 border-pink-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Bot size={20} />
          AI 추천
        </button>
      </div>

      {/* 검색 모드 */}
      {viewMode === "search" && (
        <>
          {/* 검색 */}
          <div className="mb-4 md:mb-6 flex gap-2 md:gap-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              placeholder="축제명, 지역 검색..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
            />
            <button
              onClick={handleSearch}
              className="px-4 md:px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 text-sm md:text-base"
            >
              검색
            </button>
          </div>

      {/* 축제 목록 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {festivals.map((festival) => (
          <div
            key={festival.id}
            className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden relative"
          >
            {/* 북마크 버튼 */}
            <button
              onClick={(e) => handleBookmarkToggle(festival.id, e)}
              className="absolute top-3 right-3 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <Heart
                className={`w-6 h-6 ${
                  bookmarkedIds.has(festival.id)
                    ? "fill-red-500 text-red-500"
                    : "text-gray-400"
                }`}
              />
            </button>

            <img
              src={festival.poster_image || "/placeholder.jpg"}
              alt={festival.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2">{festival.name}</h3>
              <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
                <MapPin size={14} />
                {festival.location}
              </p>
              <p className="text-sm text-gray-500 mb-4 flex items-center gap-1">
                <Calendar size={14} />
                {festival.start_date} ~ {festival.end_date}
              </p>

              {festival.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {festival.description}
                </p>
              )}

              {festival.already_applied ? (
                <div className="text-center py-2 bg-gray-100 rounded-lg text-gray-600">
                  지원 완료
                </div>
              ) : (
                <button
                  onClick={() =>
                    navigate(`/partner/festivals/${festival.id}/apply`)
                  }
                  className="w-full py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors flex items-center justify-center gap-2"
                >
                  지원하기
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

          {festivals.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              검색 결과가 없습니다
            </div>
          )}
        </>
      )}

      {/* AI 추천 모드 */}
      {viewMode === "ai" && (
        <>
          {aiLoading ? (
            /* 로딩 중 */
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-12">
                <div className="flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-500 border-t-transparent mb-6"></div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <Bot className="w-6 h-6" />
                    AI가 분석중입니다...
                  </h2>
                  <p className="text-gray-600 text-center">
                    선택하신 조건에 맞는 최적의 축제를 찾고 있습니다
                  </p>
                </div>
              </div>
            </div>
          ) : aiStep < aiQuestions.length ? (
            /* 질문 단계 */
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-8">
                {/* 진행 바 */}
                <div className="mb-8">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>질문 {aiStep + 1}/{aiQuestions.length}</span>
                    <span>{Math.round(((aiStep + 1) / aiQuestions.length) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-pink-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((aiStep + 1) / aiQuestions.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* 질문 */}
                <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                  {aiQuestions[aiStep].question}
                </h2>

                {/* 선택지 */}
                <div className="grid grid-cols-1 gap-4">
                  {aiQuestions[aiStep].options.map((option) => {
                    const IconComponent = option.icon;
                    return (
                      <button
                        key={option.value}
                        onClick={() => handleAiAnswer(option.value)}
                        className="p-6 border-2 border-gray-200 rounded-lg hover:border-pink-500 hover:bg-pink-50 transition-all text-left group"
                      >
                        <div className="flex items-center gap-4">
                          <IconComponent className="w-8 h-8 text-gray-600 group-hover:text-pink-600" />
                          <span className="text-lg font-medium text-gray-900 group-hover:text-pink-600">
                            {option.label}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* 이전 버튼 */}
                {aiStep > 0 && (
                  <div className="mt-6 text-center">
                    <button
                      onClick={() => setAiStep(aiStep - 1)}
                      className="text-gray-600 hover:text-gray-900 flex items-center gap-1 mx-auto"
                    >
                      <ArrowLeft size={16} />
                      이전 질문으로
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* 추천 결과 */
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    🎯 맞춤 추천 축제
                  </h2>
                  <p className="text-gray-600">
                    총 {recommendedFestivals.length}개의 축제를 찾았습니다
                  </p>
                </div>
                <button
                  onClick={resetAiRecommendation}
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  다시 추천받기
                </button>
              </div>

              {/* 선택한 조건 표시 */}
              <div className="bg-pink-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">선택하신 조건</h3>
                <div className="flex flex-wrap gap-2">
                  {aiAnswers.boothType && (
                    <span className="px-3 py-1 bg-white rounded-full text-sm">
                      부스: {aiQuestions[0].options.find(o => o.value === aiAnswers.boothType)?.label}
                    </span>
                  )}
                  {aiAnswers.region && (
                    <span className="px-3 py-1 bg-white rounded-full text-sm">
                      지역: {aiAnswers.region}
                    </span>
                  )}
                  {aiAnswers.budget && (
                    <span className="px-3 py-1 bg-white rounded-full text-sm">
                      예산: {aiQuestions[2].options.find(o => o.value === aiAnswers.budget)?.label}
                    </span>
                  )}
                  {aiAnswers.festivalType && (
                    <span className="px-3 py-1 bg-white rounded-full text-sm">
                      유형: {aiQuestions[3].options.find(o => o.value === aiAnswers.festivalType)?.label}
                    </span>
                  )}
                </div>
              </div>

              {/* 추천 축제 목록 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {recommendedFestivals.map((festival) => (
                  <div
                    key={festival.id}
                    className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden relative"
                  >
                    {/* 북마크 버튼 */}
                    <button
                      onClick={(e) => handleBookmarkToggle(festival.id, e)}
                      className="absolute top-3 right-3 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      <Heart
                        className={`w-6 h-6 ${
                          bookmarkedIds.has(festival.id)
                            ? "fill-red-500 text-red-500"
                            : "text-gray-400"
                        }`}
                      />
                    </button>

                    <img
                      src={festival.poster_image || "/placeholder.jpg"}
                      alt={festival.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-2">{festival.name}</h3>
                      <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
                        <MapPin size={14} />
                        {festival.location}
                      </p>
                      <p className="text-sm text-gray-500 mb-4 flex items-center gap-1">
                        <Calendar size={14} />
                        {festival.start_date} ~ {festival.end_date}
                      </p>

                      {festival.description && (
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {festival.description}
                        </p>
                      )}

                      {festival.already_applied ? (
                        <div className="text-center py-2 bg-gray-100 rounded-lg text-gray-600">
                          지원 완료
                        </div>
                      ) : (
                        <button
                          onClick={() =>
                            navigate(`/partner/festivals/${festival.id}/apply`)
                          }
                          className="w-full py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors flex items-center justify-center gap-2"
                        >
                          지원하기
                          <ArrowRight size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {recommendedFestivals.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-6xl mb-4">😢</div>
                  <p className="text-xl mb-2">조건에 맞는 축제를 찾을 수 없습니다</p>
                  <p className="text-gray-400 mb-6">다른 조건으로 다시 시도해보세요</p>
                  <button
                    onClick={resetAiRecommendation}
                    className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
                  >
                    다시 추천받기
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default FestivalBrowse;
