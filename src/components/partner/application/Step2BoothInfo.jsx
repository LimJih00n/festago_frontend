function Step2BoothInfo({ formData, updateFormData }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Step 2/4: 부스 정보
      </h2>

      <div className="space-y-6">
        {/* 희망 부스 종류 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            * 희망 부스 종류
          </label>
          <select
            value={formData.booth_type}
            onChange={(e) => updateFormData({ booth_type: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          >
            <option value="food">음식 부스</option>
            <option value="goods">굿즈 판매</option>
            <option value="experience">체험 부스</option>
            <option value="promotion">홍보 부스</option>
          </select>
        </div>

        {/* 부스 크기 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            * 부스 크기
          </label>
          <div className="space-y-3">
            <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="booth_size"
                value="3x3"
                checked={formData.booth_size === "3x3"}
                onChange={(e) =>
                  updateFormData({ booth_size: e.target.value })
                }
                className="mr-3"
              />
              <div className="flex-1">
                <span className="font-medium">3x3m (기본)</span>
                <span className="text-gray-600 ml-2">- 300,000원</span>
              </div>
            </label>
            <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="booth_size"
                value="6x3"
                checked={formData.booth_size === "6x3"}
                onChange={(e) =>
                  updateFormData({ booth_size: e.target.value })
                }
                className="mr-3"
              />
              <div className="flex-1">
                <span className="font-medium">6x3m (대형)</span>
                <span className="text-gray-600 ml-2">- 500,000원</span>
              </div>
            </label>
          </div>
        </div>

        {/* 판매/전시 품목 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            * 판매/전시 품목
          </label>
          <textarea
            value={formData.products}
            onChange={(e) => updateFormData({ products: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="예: 김밥 (5종), 떡볶이, 음료"
          />
        </div>

        {/* 예상 판매 가격대 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            * 예상 판매 가격대
          </label>
          <input
            type="text"
            value={formData.price_range}
            onChange={(e) => updateFormData({ price_range: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="예: 3,000원 ~ 8,000원"
          />
        </div>

        {/* 추가 요청사항 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            추가 요청사항 (선택)
          </label>
          <textarea
            value={formData.additional_requests}
            onChange={(e) =>
              updateFormData({ additional_requests: e.target.value })
            }
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="예: 냉장고 1대 필요"
          />
        </div>
      </div>
    </div>
  );
}

export default Step2BoothInfo;
