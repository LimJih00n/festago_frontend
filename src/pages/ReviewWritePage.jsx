import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, X, Camera } from 'lucide-react';
import { getEvent } from '../api/events';
import { createReview } from '../api/reviews';
import MobileHeader from '../components/mobile/MobileHeader';

export default function ReviewWritePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    rating: 0,
    comment: '',
    images: [],
  });

  const [imageFiles, setImageFiles] = useState([]); // 실제 파일 객체
  const [imagePreviews, setImagePreviews] = useState([]); // 미리보기 URL
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const response = await getEvent(id);
      setEvent(response.data);
    } catch (err) {
      console.error('이벤트 로딩 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRatingClick = (rating) => {
    setFormData({ ...formData, rating });
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // 최대 5개까지만 선택 가능
    const remainingSlots = 5 - imageFiles.length;
    const filesToAdd = files.slice(0, remainingSlots);

    if (filesToAdd.length < files.length) {
      alert('이미지는 최대 5개까지 첨부할 수 있습니다.');
    }

    // 미리보기 URL 생성
    const newPreviews = filesToAdd.map(file => URL.createObjectURL(file));

    setImageFiles([...imageFiles, ...filesToAdd]);
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const handleImageRemove = (index) => {
    // URL 해제 (메모리 누수 방지)
    URL.revokeObjectURL(imagePreviews[index]);

    setImageFiles(imageFiles.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 유효성 검사
    if (formData.rating === 0) {
      setError('별점을 선택해주세요.');
      return;
    }

    if (formData.comment.trim().length < 10) {
      setError('리뷰 내용을 10자 이상 작성해주세요.');
      return;
    }

    try {
      setSubmitting(true);

      // 이미지 업로드 (있는 경우)
      let uploadedImageUrls = [];
      if (imageFiles.length > 0) {
        // TODO: 실제 이미지 업로드 API 구현
        // 임시로 placeholder URL 사용
        uploadedImageUrls = imageFiles.map((_, index) =>
          `https://placeholder.com/image${index}.jpg`
        );
      }

      await createReview({
        event_id: id,
        rating: formData.rating,
        comment: formData.comment.trim(),
        images: uploadedImageUrls,
      });

      // 성공 시 리뷰 페이지로 이동
      alert('리뷰가 작성되었습니다!');
      navigate(`/events/${id}/reviews`);
    } catch (err) {
      console.error('리뷰 작성 실패:', err);
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError('리뷰 작성에 실패했습니다. 로그인 후 다시 시도해주세요.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <MobileHeader showBackButton={true} title="리뷰 작성" showLogo={false} />
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
    <div className="min-h-screen bg-gray-50 pb-24">
      <MobileHeader showBackButton={true} title="리뷰 작성" showLogo={false} />

      <form onSubmit={handleSubmit} className="px-4 py-6">
        {/* 이벤트 정보 */}
        <div className="mobile-card mb-6">
          <div className="flex gap-3 p-4">
            <img
              src={event.poster_image}
              alt={event.name}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">{event.name}</h3>
              <p className="text-xs text-gray-500">{event.location}</p>
            </div>
          </div>
        </div>

        {/* 별점 선택 */}
        <div className="mobile-card mb-6">
          <div className="p-6 text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              이 축제는 어땠나요?
            </h3>
            <div className="flex justify-center gap-2 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingClick(star)}
                  className="touch-feedback"
                >
                  <Star
                    size={40}
                    className={`transition-colors ${
                      star <= formData.rating
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            {formData.rating > 0 && (
              <p className="text-sm text-gray-600">
                {formData.rating === 5 && '최고예요! ⭐'}
                {formData.rating === 4 && '좋아요! 😊'}
                {formData.rating === 3 && '보통이에요 😐'}
                {formData.rating === 2 && '별로예요 😕'}
                {formData.rating === 1 && '실망했어요 😞'}
              </p>
            )}
          </div>
        </div>

        {/* 사진 추가 */}
        <div className="mobile-card mb-6">
          <div className="p-4">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              사진 추가 (선택)
            </label>

            <div className="flex gap-3 overflow-x-auto pb-2">
              {/* 사진 추가 버튼 */}
              {imagePreviews.length < 5 && (
                <label className="flex-shrink-0 w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-pink-500 hover:bg-pink-50 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  <Camera size={24} className="text-gray-400 mb-1" />
                  <span className="text-xs text-gray-500">
                    {imagePreviews.length}/5
                  </span>
                </label>
              )}

              {/* 선택된 이미지 미리보기 */}
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative flex-shrink-0 w-24 h-24">
                  <img
                    src={preview}
                    alt={`preview-${index}`}
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => handleImageRemove(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>

            {imagePreviews.length === 0 && (
              <p className="text-xs text-gray-500 mt-2">
                축제의 생생한 모습을 담은 사진을 올려주세요!
              </p>
            )}
          </div>
        </div>

        {/* 리뷰 내용 */}
        <div className="mobile-card mb-6">
          <div className="p-4">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              리뷰 작성
            </label>
            <textarea
              value={formData.comment}
              onChange={(e) =>
                setFormData({ ...formData, comment: e.target.value })
              }
              placeholder="축제에 대한 솔직한 후기를 남겨주세요.&#10;다른 분들에게 큰 도움이 됩니다! (최소 10자)"
              className="w-full h-40 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none text-sm"
              maxLength={500}
            />
            <div className="mt-2 text-right text-xs text-gray-500">
              {formData.comment.length} / 500자
            </div>
          </div>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* 제출 버튼 */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t safe-area-inset-bottom z-50">
          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-4 rounded-2xl font-semibold shadow-lg transition-colors ${
              submitting
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-pink-500 text-white hover:bg-pink-600'
            }`}
          >
            {submitting ? '작성 중...' : '리뷰 등록'}
          </button>
        </div>
      </form>
    </div>
  );
}
