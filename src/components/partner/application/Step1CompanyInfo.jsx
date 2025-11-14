function Step1CompanyInfo({ formData, updateFormData }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Step 1/4: 기업 정보
      </h2>

      <div className="space-y-6">
        {/* 상호명 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            * 상호명
          </label>
          <input
            type="text"
            value={formData.company_name}
            onChange={(e) =>
              updateFormData({ company_name: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="예: 김밥천국 본점"
          />
        </div>

        {/* 사업자등록번호 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            * 사업자등록번호
          </label>
          <input
            type="text"
            value={formData.business_number}
            onChange={(e) =>
              updateFormData({ business_number: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="예: 123-45-67890"
          />
        </div>

        {/* 대표자명 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            * 대표자명
          </label>
          <input
            type="text"
            value={formData.representative_name}
            onChange={(e) =>
              updateFormData({ representative_name: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="예: 홍길동"
          />
        </div>

        {/* 연락처 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            * 연락처
          </label>
          <input
            type="tel"
            value={formData.contact_phone}
            onChange={(e) =>
              updateFormData({ contact_phone: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="예: 010-1234-5678"
          />
        </div>

        {/* 이메일 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            * 이메일
          </label>
          <input
            type="email"
            value={formData.contact_email}
            onChange={(e) =>
              updateFormData({ contact_email: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="예: contact@kimbap.com"
          />
        </div>
      </div>

      <div className="mt-6 p-4 bg-pink-50 rounded-lg">
        <p className="text-sm text-pink-800">
          💡 프로필에서 설정한 정보가 자동으로 입력됩니다.
        </p>
      </div>
    </div>
  );
}

export default Step1CompanyInfo;
