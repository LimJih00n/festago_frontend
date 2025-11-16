import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { applicationAPI, draftAPI, uploadAPI } from "../../api/partner";
import axios from "../../api/axios";

// 단계별 컴포넌트
import Step1CompanyInfo from "../../components/partner/application/Step1CompanyInfo";
import Step2BoothInfo from "../../components/partner/application/Step2BoothInfo";
import Step3BrandInfo from "../../components/partner/application/Step3BrandInfo";
import Step4Confirmation from "../../components/partner/application/Step4Confirmation";

function ApplicationForm() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // 폼 데이터
  const [formData, setFormData] = useState({
    // Step 1: 기업 정보
    company_name: "",
    business_number: "",
    representative_name: "",
    contact_phone: "",
    contact_email: "",

    // Step 2: 부스 정보
    booth_type: "food",
    booth_size: "3x3",
    products: "",
    price_range: "",
    additional_requests: "",

    // Step 3: 브랜드 소개
    brand_description: "",
    brand_logo: null,
    product_images: [],
    instagram: "",
    website: "",

    // Step 4: 참여 경험
    has_experience: false,
    previous_festivals: "",
    portfolio_url: "",
    agree_privacy: false,
    agree_refund: false,
  });

  useEffect(() => {
    loadEventData();
    loadDraft();
  }, [eventId]);

  // 축제 정보 로드
  const loadEventData = async () => {
    try {
      const { data } = await axios.get(`/api/events/${eventId}/`);
      setEventData(data);
    } catch (error) {
      console.error("축제 정보 로드 실패:", error);
      setEventData(null);
    } finally {
      setLoading(false);
    }
  };

  // 임시저장 불러오기
  const loadDraft = async () => {
    try {
      const { data } = await draftAPI.getByEvent(eventId);
      if (data && data.draft_data) {
        setFormData({ ...formData, ...data.draft_data });
        // 마지막 작성 단계로 이동
        if (data.draft_data.current_step) {
          setCurrentStep(data.draft_data.current_step);
        }
      }
    } catch (error) {
      console.log("임시저장 데이터 없음");
    }
  };

  // 임시저장
  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      const draftData = { ...formData, current_step: currentStep };
      await draftAPI.createDraft({
        event: eventId,
        draft_data: draftData,
      });
      alert("임시저장되었습니다!");
    } catch (error) {
      console.error("임시저장 실패:", error);
      alert("임시저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  // 다음 단계
  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep(currentStep + 1);
      // 자동 임시저장
      handleSaveDraft();
    }
  };

  // 이전 단계
  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  // 현재 단계 유효성 검사
  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        if (
          !formData.company_name ||
          !formData.business_number ||
          !formData.representative_name ||
          !formData.contact_phone ||
          !formData.contact_email
        ) {
          alert("필수 항목을 모두 입력해주세요.");
          return false;
        }
        break;
      case 2:
        if (!formData.booth_type || !formData.booth_size || !formData.products) {
          alert("필수 항목을 모두 입력해주세요.");
          return false;
        }
        break;
      case 3:
        if (!formData.brand_description || formData.brand_description.length < 100) {
          alert("브랜드 소개글은 최소 100자 이상 작성해주세요.");
          return false;
        }
        if (!formData.brand_logo) {
          alert("대표 이미지를 업로드해주세요.");
          return false;
        }
        break;
      case 4:
        if (!formData.agree_privacy || !formData.agree_refund) {
          alert("필수 약관에 동의해주세요.");
          return false;
        }
        break;
    }
    return true;
  };

  // 최종 제출
  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;

    setSubmitting(true);
    try {
      // 이미지 파일 업로드 처리
      let logoUrl = formData.brand_logo;
      if (formData.brand_logo instanceof File) {
        const logoFormData = new FormData();
        logoFormData.append("image", formData.brand_logo);
        logoFormData.append("image_type", "logo");
        const { data: logoData } = await uploadAPI.uploadImage(logoFormData);
        logoUrl = logoData.image;
      }

      const productImageUrls = [];
      for (const img of formData.product_images) {
        if (img instanceof File) {
          const imgFormData = new FormData();
          imgFormData.append("image", img);
          imgFormData.append("image_type", "product");
          const { data: imgData } = await uploadAPI.uploadImage(imgFormData);
          productImageUrls.push(imgData.image);
        } else {
          productImageUrls.push(img);
        }
      }

      // 지원서 제출 (백엔드 필드명에 맞춤)
      const applicationData = {
        event: eventId,
        booth_type: formData.booth_type,
        booth_size: formData.booth_size,
        products: formData.products,
        price_range: formData.price_range,
        special_requests: formData.additional_requests, // backend: special_requests
        brand_intro: formData.brand_description, // backend: brand_intro
        brand_images: [logoUrl, ...productImageUrls], // backend: brand_images (array)
        has_experience: formData.has_experience,
        previous_festivals: formData.previous_festivals,
        portfolio_url: formData.portfolio_url,
      };

      await applicationAPI.createApplication(applicationData);

      // 임시저장 삭제
      try {
        const { data } = await draftAPI.getByEvent(eventId);
        if (data && data.id) {
          await draftAPI.deleteDraft(data.id);
        }
      } catch (error) {
        console.log("임시저장 삭제 실패 (무시)");
      }

      alert("지원서가 제출되었습니다!");
      navigate("/partner/applications");
    } catch (error) {
      console.error("지원서 제출 실패:", error);
      alert("지원서 제출에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const updateFormData = (updates) => {
    setFormData({ ...formData, ...updates });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-xl text-gray-600">축제 정보를 찾을 수 없습니다.</p>
        <button
          onClick={() => navigate("/partner/festivals")}
          className="mt-4 px-4 py-2 bg-pink-600 text-white rounded-lg"
        >
          축제 목록으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            📝 "{eventData.name}" 참여 지원서
          </h1>
          <p className="text-gray-600">
            {eventData.application_deadline && (
              <>
                마감까지{" "}
                {Math.ceil(
                  (new Date(eventData.application_deadline) - new Date()) /
                    (1000 * 60 * 60 * 24)
                )}
                일 남음
              </>
            )}
          </p>
        </div>

        {/* 단계 표시 */}
        <div className="bg-white rounded-lg shadow p-4 md:p-6 mb-4 md:mb-6">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm md:text-base ${
                    currentStep >= step
                      ? "bg-pink-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step}
                </div>
                {step < 4 && (
                  <div
                    className={`w-8 md:w-20 h-1 mx-1 md:mx-2 ${
                      currentStep > step ? "bg-pink-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs md:text-sm text-gray-600">
            <span>기업 정보</span>
            <span>부스 정보</span>
            <span>브랜드 소개</span>
            <span>최종 확인</span>
          </div>
        </div>

        {/* 단계별 폼 */}
        <div className="bg-white rounded-lg shadow p-8">
          {currentStep === 1 && (
            <Step1CompanyInfo formData={formData} updateFormData={updateFormData} />
          )}
          {currentStep === 2 && (
            <Step2BoothInfo formData={formData} updateFormData={updateFormData} />
          )}
          {currentStep === 3 && (
            <Step3BrandInfo formData={formData} updateFormData={updateFormData} />
          )}
          {currentStep === 4 && (
            <Step4Confirmation
              formData={formData}
              updateFormData={updateFormData}
              eventData={eventData}
            />
          )}

          {/* 버튼 */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <div>
              {currentStep > 1 && (
                <button
                  onClick={handlePrev}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  ← 이전
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSaveDraft}
                disabled={saving}
                className="px-6 py-2 border border-pink-600 text-pink-600 rounded-lg hover:bg-pink-50 disabled:opacity-50"
              >
                {saving ? "저장 중..." : "임시저장"}
              </button>
              {currentStep < 4 ? (
                <button
                  onClick={handleNext}
                  className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                >
                  다음 단계 →
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {submitting ? "제출 중..." : "제출하기 ✅"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplicationForm;
