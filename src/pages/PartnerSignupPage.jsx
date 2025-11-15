import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, Phone, ChevronLeft, Building2, FileText, Store } from 'lucide-react';
import { partnerSignup } from '../api/partner';

export default function PartnerSignupPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1); // 1: 계정정보, 2: 사업자정보, 3: 브랜드정보
  const [formData, setFormData] = useState({
    // 계정 정보
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',

    // 사업자 기본 정보
    business_name: '',
    business_number: '',
    representative_name: '',
    business_type: '',
    address: '',
    postal_code: '',
    phone: '',
    partner_email: '',

    // 브랜드 정보
    brand_name: '',
    brand_intro: '',
    products: '',
    website: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const validateStep1 = () => {
    if (!formData.username || !formData.email || !formData.password) {
      setError('모든 필수 항목을 입력해주세요.');
      return false;
    }
    if (formData.password !== formData.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return false;
    }
    if (formData.password.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.business_name || !formData.business_number || !formData.representative_name ||
        !formData.business_type || !formData.address || !formData.phone || !formData.partner_email) {
      setError('모든 필수 항목을 입력해주세요.');
      return false;
    }
    // 사업자등록번호 형식 체크 (간단한 체크)
    if (formData.business_number.length < 10) {
      setError('사업자등록번호를 정확히 입력해주세요.');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!formData.brand_name || !formData.brand_intro || !formData.products) {
      setError('모든 필수 항목을 입력해주세요.');
      return false;
    }
    if (formData.brand_intro.length < 20) {
      setError('브랜드 소개는 20자 이상 작성해주세요.');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    setError('');
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handlePrev = () => {
    setError('');
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep3()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      await partnerSignup({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        business_name: formData.business_name,
        business_number: formData.business_number,
        representative_name: formData.representative_name,
        business_type: formData.business_type,
        address: formData.address,
        postal_code: formData.postal_code,
        phone: formData.phone,
        partner_email: formData.partner_email,
        brand_name: formData.brand_name,
        brand_intro: formData.brand_intro,
        products: formData.products,
        website: formData.website,
      });

      alert('파트너 회원가입이 완료되었습니다! 승인 후 이용 가능합니다.');
      navigate('/login/partner');
    } catch (err) {
      console.error('회원가입 실패:', err);
      if (err.response?.data) {
        const errors = err.response.data;
        const errorMessages = Object.entries(errors)
          .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
          .join('\n');
        setError(errorMessages || '회원가입에 실패했습니다.');
      } else {
        setError('회원가입에 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-pink-200 via-pink-300 to-pink-200 flex flex-col overflow-hidden overscroll-none">
      {/* 헤더 */}
      <div className="p-4 flex items-center gap-4">
        <button onClick={() => currentStep === 1 ? navigate('/login') : handlePrev()} className="p-1">
          <ChevronLeft size={24} className="text-gray-800" />
        </button>
        <h2 className="text-lg font-semibold text-gray-900">파트너 회원가입</h2>
      </div>

      {/* 진행 단계 표시 */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-2">
          <div className={`flex items-center ${currentStep >= 1 ? 'text-pink-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-pink-600 text-white' : 'bg-gray-300'}`}>
              1
            </div>
            <span className="ml-2 text-xs font-semibold">계정정보</span>
          </div>
          <div className={`flex-1 h-1 mx-2 ${currentStep >= 2 ? 'bg-pink-600' : 'bg-gray-300'}`}></div>
          <div className={`flex items-center ${currentStep >= 2 ? 'text-pink-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-pink-600 text-white' : 'bg-gray-300'}`}>
              2
            </div>
            <span className="ml-2 text-xs font-semibold">사업자정보</span>
          </div>
          <div className={`flex-1 h-1 mx-2 ${currentStep >= 3 ? 'bg-pink-600' : 'bg-gray-300'}`}></div>
          <div className={`flex items-center ${currentStep >= 3 ? 'text-pink-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-pink-600 text-white' : 'bg-gray-300'}`}>
              3
            </div>
            <span className="ml-2 text-xs font-semibold">브랜드정보</span>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col items-center px-6 py-8 overflow-y-auto">
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
          {/* 에러 메시지 */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl text-sm whitespace-pre-line">
              {error}
            </div>
          )}

          {/* Step 1: 계정 정보 */}
          {currentStep === 1 && (
            <>
              <div className="relative">
                <UserIcon
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                  size={20}
                />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="아이디"
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-pink-100 border-2 border-pink-400 rounded-xl text-gray-900 placeholder-gray-600 focus:outline-none focus:border-pink-500 transition-colors"
                />
              </div>

              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                  size={20}
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="로그인용 이메일"
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-pink-100 border-2 border-pink-400 rounded-xl text-gray-900 placeholder-gray-600 focus:outline-none focus:border-pink-500 transition-colors"
                />
              </div>

              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                  size={20}
                />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="비밀번호 (8자 이상)"
                  required
                  minLength={8}
                  className="w-full pl-12 pr-4 py-3.5 bg-pink-100 border-2 border-pink-400 rounded-xl text-gray-900 placeholder-gray-600 focus:outline-none focus:border-pink-500 transition-colors"
                />
              </div>

              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                  size={20}
                />
                <input
                  type="password"
                  name="passwordConfirm"
                  value={formData.passwordConfirm}
                  onChange={handleChange}
                  placeholder="비밀번호 확인"
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-pink-100 border-2 border-pink-400 rounded-xl text-gray-900 placeholder-gray-600 focus:outline-none focus:border-pink-500 transition-colors"
                />
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="w-full bg-black text-white py-3.5 rounded-full font-medium text-sm hover:bg-gray-900 transition-colors shadow-md mt-6"
              >
                다음
              </button>
            </>
          )}

          {/* Step 2: 사업자 정보 */}
          {currentStep === 2 && (
            <>
              <div className="relative">
                <Building2
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                  size={20}
                />
                <input
                  type="text"
                  name="business_name"
                  value={formData.business_name}
                  onChange={handleChange}
                  placeholder="상호명"
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-pink-100 border-2 border-pink-400 rounded-xl text-gray-900 placeholder-gray-600 focus:outline-none focus:border-pink-500 transition-colors"
                />
              </div>

              <div className="relative">
                <FileText
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                  size={20}
                />
                <input
                  type="text"
                  name="business_number"
                  value={formData.business_number}
                  onChange={handleChange}
                  placeholder="사업자등록번호 (숫자만)"
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-pink-100 border-2 border-pink-400 rounded-xl text-gray-900 placeholder-gray-600 focus:outline-none focus:border-pink-500 transition-colors"
                />
              </div>

              <div className="relative">
                <UserIcon
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                  size={20}
                />
                <input
                  type="text"
                  name="representative_name"
                  value={formData.representative_name}
                  onChange={handleChange}
                  placeholder="대표자명"
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-pink-100 border-2 border-pink-400 rounded-xl text-gray-900 placeholder-gray-600 focus:outline-none focus:border-pink-500 transition-colors"
                />
              </div>

              <div className="relative">
                <Store
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                  size={20}
                />
                <input
                  type="text"
                  name="business_type"
                  value={formData.business_type}
                  onChange={handleChange}
                  placeholder="업종 (예: 음식점, 제조업 등)"
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-pink-100 border-2 border-pink-400 rounded-xl text-gray-900 placeholder-gray-600 focus:outline-none focus:border-pink-500 transition-colors"
                />
              </div>

              <div>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="사업장 주소"
                  required
                  className="w-full px-4 py-3.5 bg-pink-100 border-2 border-pink-400 rounded-xl text-gray-900 placeholder-gray-600 focus:outline-none focus:border-pink-500 transition-colors"
                />
              </div>

              <div>
                <input
                  type="text"
                  name="postal_code"
                  value={formData.postal_code}
                  onChange={handleChange}
                  placeholder="우편번호 (선택)"
                  className="w-full px-4 py-3.5 bg-pink-100 border-2 border-pink-400 rounded-xl text-gray-900 placeholder-gray-600 focus:outline-none focus:border-pink-500 transition-colors"
                />
              </div>

              <div className="relative">
                <Phone
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                  size={20}
                />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="대표 연락처"
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-pink-100 border-2 border-pink-400 rounded-xl text-gray-900 placeholder-gray-600 focus:outline-none focus:border-pink-500 transition-colors"
                />
              </div>

              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                  size={20}
                />
                <input
                  type="email"
                  name="partner_email"
                  value={formData.partner_email}
                  onChange={handleChange}
                  placeholder="사업자 대표 이메일"
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-pink-100 border-2 border-pink-400 rounded-xl text-gray-900 placeholder-gray-600 focus:outline-none focus:border-pink-500 transition-colors"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="flex-1 bg-gray-300 text-gray-800 py-3.5 rounded-full font-medium text-sm hover:bg-gray-400 transition-colors shadow-md mt-6"
                >
                  이전
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 bg-black text-white py-3.5 rounded-full font-medium text-sm hover:bg-gray-900 transition-colors shadow-md mt-6"
                >
                  다음
                </button>
              </div>
            </>
          )}

          {/* Step 3: 브랜드 정보 */}
          {currentStep === 3 && (
            <>
              <div>
                <input
                  type="text"
                  name="brand_name"
                  value={formData.brand_name}
                  onChange={handleChange}
                  placeholder="브랜드명"
                  required
                  className="w-full px-4 py-3.5 bg-pink-100 border-2 border-pink-400 rounded-xl text-gray-900 placeholder-gray-600 focus:outline-none focus:border-pink-500 transition-colors"
                />
              </div>

              <div>
                <textarea
                  name="brand_intro"
                  value={formData.brand_intro}
                  onChange={handleChange}
                  placeholder="브랜드 소개 (최소 20자)"
                  required
                  rows={4}
                  className="w-full px-4 py-3.5 bg-pink-100 border-2 border-pink-400 rounded-xl text-gray-900 placeholder-gray-600 focus:outline-none focus:border-pink-500 transition-colors resize-none"
                />
                <div className="text-right text-xs text-gray-600 mt-1">
                  {formData.brand_intro.length} / 20자 이상
                </div>
              </div>

              <div>
                <textarea
                  name="products"
                  value={formData.products}
                  onChange={handleChange}
                  placeholder="대표 제품/메뉴 (예: 김밥, 떡볶이, 음료 등)"
                  required
                  rows={3}
                  className="w-full px-4 py-3.5 bg-pink-100 border-2 border-pink-400 rounded-xl text-gray-900 placeholder-gray-600 focus:outline-none focus:border-pink-500 transition-colors resize-none"
                />
              </div>

              <div>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="공식 웹사이트 (선택)"
                  className="w-full px-4 py-3.5 bg-pink-100 border-2 border-pink-400 rounded-xl text-gray-900 placeholder-gray-600 focus:outline-none focus:border-pink-500 transition-colors"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="flex-1 bg-gray-300 text-gray-800 py-3.5 rounded-full font-medium text-sm hover:bg-gray-400 transition-colors shadow-md mt-6"
                >
                  이전
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-black text-white py-3.5 rounded-full font-medium text-sm hover:bg-gray-900 transition-colors shadow-md mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '가입 중...' : '회원가입'}
                </button>
              </div>
            </>
          )}

          {/* 로그인 링크 */}
          <div className="text-center pt-4">
            <p className="text-sm text-gray-700">
              이미 계정이 있으신가요?{' '}
              <button
                type="button"
                onClick={() => navigate('/login/partner')}
                className="text-gray-900 font-semibold hover:underline"
              >
                로그인
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
