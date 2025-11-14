import { useState } from "react";

function Step3BrandInfo({ formData, updateFormData }) {
  const [logoPreview, setLogoPreview] = useState(null);
  const [productPreviews, setProductPreviews] = useState([]);

  // 대표 이미지 업로드
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("파일 크기는 5MB 이하여야 합니다.");
        return;
      }
      updateFormData({ brand_logo: file });
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  // 제품 이미지 업로드
  const handleProductImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const currentImages = formData.product_images || [];

    if (currentImages.length + files.length > 5) {
      alert("제품 이미지는 최대 5장까지 업로드 가능합니다.");
      return;
    }

    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name}의 크기가 5MB를 초과합니다.`);
        continue;
      }
    }

    updateFormData({ product_images: [...currentImages, ...files] });
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setProductPreviews([...productPreviews, ...newPreviews]);
  };

  // 제품 이미지 삭제
  const handleRemoveProductImage = (index) => {
    const newImages = formData.product_images.filter((_, i) => i !== index);
    updateFormData({ product_images: newImages });
    const newPreviews = productPreviews.filter((_, i) => i !== index);
    setProductPreviews(newPreviews);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Step 3/4: 브랜드 소개
      </h2>

      <div className="space-y-6">
        {/* 브랜드 소개글 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            * 브랜드 소개글 (공개됨)
          </label>
          <textarea
            value={formData.brand_description}
            onChange={(e) =>
              updateFormData({ brand_description: e.target.value })
            }
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="저희 김밥천국은 1995년부터 전통 방식으로 김밥을 만들어온 로컬 브랜드입니다. 신선한 재료만을 사용하며..."
          />
          <p className="text-sm text-gray-500 mt-1">
            {formData.brand_description.length}/500 (최소 100자)
          </p>
        </div>

        {/* 대표 이미지 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            * 대표 이미지 (필수)
          </label>
          <div className="flex items-start gap-4">
            <label className="flex flex-col items-center justify-center w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <span className="text-3xl mb-2">📷</span>
              <span className="text-sm text-gray-600">이미지 업로드</span>
              <span className="text-xs text-gray-500">JPG, PNG (최대 5MB)</span>
            </label>
            {(logoPreview || formData.brand_logo) && (
              <div className="relative w-40 h-40">
                <img
                  src={logoPreview || formData.brand_logo}
                  alt="대표 이미지"
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  onClick={() => {
                    updateFormData({ brand_logo: null });
                    setLogoPreview(null);
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 제품/메뉴 사진 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            제품/메뉴 사진 (최대 5장)
          </label>
          <div className="flex flex-wrap gap-4">
            {formData.product_images &&
              formData.product_images.map((img, index) => (
                <div key={index} className="relative w-32 h-32">
                  <img
                    src={
                      img instanceof File
                        ? productPreviews[index]
                        : img
                    }
                    alt={`제품 ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    onClick={() => handleRemoveProductImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            {(!formData.product_images || formData.product_images.length < 5) && (
              <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  multiple
                  onChange={handleProductImageUpload}
                  className="hidden"
                />
                <span className="text-2xl mb-1">📷</span>
                <span className="text-xs text-gray-600">추가</span>
              </label>
            )}
          </div>
        </div>

        {/* SNS/웹사이트 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instagram (선택)
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 rounded-l-lg text-gray-500">
                @
              </span>
              <input
                type="text"
                value={formData.instagram}
                onChange={(e) =>
                  updateFormData({ instagram: e.target.value })
                }
                className="flex-1 px-4 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="kimbap_chunguk"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website (선택)
            </label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => updateFormData({ website: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="https://kimbap.com"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
        <p className="text-sm text-yellow-800">
          💡 브랜드 정보는 축제 방문객에게 공개됩니다. 매력적으로 작성해주세요!
        </p>
      </div>
    </div>
  );
}

export default Step3BrandInfo;
