function Step4Confirmation({ formData, updateFormData, eventData }) {
  const boothTypeLabel = {
    food: "음식 부스",
    goods: "굿즈 판매",
    experience: "체험 부스",
    promotion: "홍보 부스",
  };

  const boothSizePrice = {
    "3x3": "300,000원",
    "6x3": "500,000원",
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Step 4/4: 참여 경험 & 최종 확인
      </h2>

      <div className="space-y-6">
        {/* 이전 축제 참여 경험 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            이전 축제 참여 경험이 있나요?
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="has_experience"
                checked={formData.has_experience === true}
                onChange={() => updateFormData({ has_experience: true })}
                className="mr-2"
              />
              <span>예</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="has_experience"
                checked={formData.has_experience === false}
                onChange={() => updateFormData({ has_experience: false })}
                className="mr-2"
              />
              <span>아니오</span>
            </label>
          </div>
        </div>

        {/* 경험이 있을 경우 */}
        {formData.has_experience && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                참여한 축제 이름
              </label>
              <input
                type="text"
                value={formData.previous_festivals}
                onChange={(e) =>
                  updateFormData({ previous_festivals: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="예: 부산 해운대축제 2024"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                포트폴리오/참여 사진 URL
              </label>
              <input
                type="url"
                value={formData.portfolio_url}
                onChange={(e) =>
                  updateFormData({ portfolio_url: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="예: https://photos.com/event2024"
              />
            </div>
          </>
        )}

        {/* 구분선 */}
        <hr className="my-8" />

        {/* 지원 내용 최종 확인 */}
        <div className="bg-pink-50 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            📋 지원 내용 최종 확인
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex">
              <span className="font-medium text-gray-700 w-24">축제:</span>
              <span className="text-gray-900">{eventData.name}</span>
            </div>
            <div className="flex">
              <span className="font-medium text-gray-700 w-24">부스:</span>
              <span className="text-gray-900">
                {boothTypeLabel[formData.booth_type]} ({formData.booth_size})
              </span>
            </div>
            <div className="flex">
              <span className="font-medium text-gray-700 w-24">참가비:</span>
              <span className="text-gray-900">
                {boothSizePrice[formData.booth_size]}
              </span>
            </div>
            <div className="flex">
              <span className="font-medium text-gray-700 w-24">품목:</span>
              <span className="text-gray-900">{formData.products}</span>
            </div>
            <div className="flex">
              <span className="font-medium text-gray-700 w-24">가격대:</span>
              <span className="text-gray-900">{formData.price_range}</span>
            </div>
          </div>
        </div>

        {/* 약관 동의 */}
        <div className="space-y-3">
          <label className="flex items-start">
            <input
              type="checkbox"
              checked={formData.agree_privacy}
              onChange={(e) =>
                updateFormData({ agree_privacy: e.target.checked })
              }
              className="mt-1 mr-3"
            />
            <span className="text-sm text-gray-700">
              <span className="text-red-500">*</span> 개인정보 수집 및 이용에
              동의합니다.
            </span>
          </label>
          <label className="flex items-start">
            <input
              type="checkbox"
              checked={formData.agree_refund}
              onChange={(e) =>
                updateFormData({ agree_refund: e.target.checked })
              }
              className="mt-1 mr-3"
            />
            <span className="text-sm text-gray-700">
              <span className="text-red-500">*</span> 참가비 환불 규정에
              동의합니다.
            </span>
          </label>
        </div>
      </div>

      <div className="mt-6 p-4 bg-green-50 rounded-lg">
        <p className="text-sm text-green-800">
          ✅ 제출 후 주최자 검토를 거쳐 승인 여부가 결정됩니다. (평균 3일 소요)
        </p>
      </div>
    </div>
  );
}

export default Step4Confirmation;
