import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { partnerAPI, uploadAPI } from "../../api/partner";
import { Building2, Edit3, Save } from "lucide-react";

function PartnerProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("basic"); // basic, brand

  // 프로필 이미지 미리보기
  const [logoPreview, setLogoPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

  // 편집용 폼 데이터
  const [formData, setFormData] = useState({
    // 기본 정보 (비공개)
    business_name: "",
    business_number: "",
    representative_name: "",
    business_type: "",
    address: "",
    address_detail: "",
    postal_code: "",
    contact_phone: "",
    contact_email: "",

    // 브랜드 정보 (공개)
    brand_name: "",
    brand_description: "",
    brand_logo: null,
    brand_banner: null,
    instagram: "",
    website: "",
    tags: [],
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data } = await partnerAPI.getMyProfile();
      setProfile(data);
      setFormData({
        business_name: data.business_name || "",
        business_number: data.business_number || "",
        representative_name: data.representative_name || "",
        business_type: data.business_type || "",
        address: data.address || "",
        address_detail: data.address_detail || "",
        postal_code: data.postal_code || "",
        contact_phone: data.contact_phone || "",
        contact_email: data.contact_email || "",
        brand_name: data.brand_name || "",
        brand_description: data.brand_description || "",
        brand_logo: data.brand_logo || null,
        brand_banner: data.brand_banner || null,
        instagram: data.instagram || "",
        website: data.website || "",
        tags: data.tags || [],
      });
    } catch (error) {
      console.error("프로필 로딩 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  // 프로필 이미지 업로드
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("파일 크기는 5MB 이하여야 합니다.");
      return;
    }

    setLogoPreview(URL.createObjectURL(file));
    setFormData({ ...formData, brand_logo: file });
  };

  // 배너 이미지 업로드
  const handleBannerUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("파일 크기는 5MB 이하여야 합니다.");
      return;
    }

    setBannerPreview(URL.createObjectURL(file));
    setFormData({ ...formData, brand_banner: file });
  };

  // 프로필 저장
  const handleSave = async () => {
    setSaving(true);
    try {
      // 이미지 업로드
      let logoUrl = formData.brand_logo;
      if (formData.brand_logo instanceof File) {
        const logoFormData = new FormData();
        logoFormData.append("image", formData.brand_logo);
        logoFormData.append("image_type", "brand_logo");
        const { data: logoData } = await uploadAPI.uploadImage(logoFormData);
        logoUrl = logoData.image;
      }

      let bannerUrl = formData.brand_banner;
      if (formData.brand_banner instanceof File) {
        const bannerFormData = new FormData();
        bannerFormData.append("image", formData.brand_banner);
        bannerFormData.append("image_type", "brand_banner");
        const { data: bannerData } = await uploadAPI.uploadImage(bannerFormData);
        bannerUrl = bannerData.image;
      }

      // 프로필 업데이트
      const updateData = {
        ...formData,
        brand_logo: logoUrl,
        brand_banner: bannerUrl,
      };

      await partnerAPI.updateProfile(profile.id, updateData);
      alert("프로필이 저장되었습니다!");
      setEditMode(false);
      loadProfile();
    } catch (error) {
      console.error("프로필 저장 실패:", error);
      alert("프로필 저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const updateFormData = (updates) => {
    setFormData({ ...formData, ...updates });
  };

  const handleLogout = () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("username");
      navigate("/login/partner");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      {/* 헤더 */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Building2 className="w-8 h-8" />
          사업자 프로필 관리
        </h1>
        <div className="flex gap-3">
          {editMode ? (
            <>
              <button
                onClick={() => {
                  setEditMode(false);
                  loadProfile();
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50 flex items-center gap-2"
              >
                <Save size={18} />
                {saving ? "저장 중..." : "저장하기"}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditMode(true)}
                className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 flex items-center gap-2"
              >
                <Edit3 size={18} />
                편집 모드
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
              >
                로그아웃
              </button>
            </>
          )}
        </div>
      </div>

      {/* 탭 */}
      <div className="flex gap-2 mb-6 border-b">
        <button
          onClick={() => setActiveTab("basic")}
          className={`px-6 py-3 font-medium ${
            activeTab === "basic"
              ? "text-pink-600 border-b-2 border-pink-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          기본 정보 (비공개)
        </button>
        <button
          onClick={() => setActiveTab("brand")}
          className={`px-6 py-3 font-medium ${
            activeTab === "brand"
              ? "text-pink-600 border-b-2 border-pink-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          브랜드 정보 (공개용)
        </button>
      </div>

      {/* Tab 1: 기본 정보 */}
      {activeTab === "basic" && (
        <div className="bg-white rounded-lg shadow p-8">
          <div className="space-y-6">
            {/* 상호명 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                * 상호명
              </label>
              {editMode ? (
                <input
                  type="text"
                  value={formData.business_name}
                  onChange={(e) =>
                    updateFormData({ business_name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                />
              ) : (
                <p className="text-lg text-gray-900">{profile.business_name}</p>
              )}
            </div>

            {/* 사업자등록번호 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                * 사업자등록번호
              </label>
              {editMode ? (
                <input
                  type="text"
                  value={formData.business_number}
                  onChange={(e) =>
                    updateFormData({ business_number: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                />
              ) : (
                <p className="text-lg text-gray-900">{profile.business_number}</p>
              )}
            </div>

            {/* 대표자명 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                * 대표자명
              </label>
              {editMode ? (
                <input
                  type="text"
                  value={formData.representative_name}
                  onChange={(e) =>
                    updateFormData({ representative_name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                />
              ) : (
                <p className="text-lg text-gray-900">
                  {profile.representative_name}
                </p>
              )}
            </div>

            {/* 업종 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                * 업종
              </label>
              {editMode ? (
                <select
                  value={formData.business_type}
                  onChange={(e) =>
                    updateFormData({ business_type: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                >
                  <option value="">선택하세요</option>
                  <option value="food">음식점 - 분식</option>
                  <option value="restaurant">음식점 - 일반</option>
                  <option value="cafe">카페/디저트</option>
                  <option value="retail">소매업</option>
                  <option value="craft">공예/수공예</option>
                  <option value="other">기타</option>
                </select>
              ) : (
                <p className="text-lg text-gray-900">{profile.business_type}</p>
              )}
            </div>

            {/* 주소 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                * 사업장 주소
              </label>
              {editMode ? (
                <>
                  <input
                    type="text"
                    value={formData.postal_code}
                    onChange={(e) =>
                      updateFormData({ postal_code: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 mb-2"
                    placeholder="우편번호"
                  />
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) =>
                      updateFormData({ address: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 mb-2"
                    placeholder="주소"
                  />
                  <input
                    type="text"
                    value={formData.address_detail}
                    onChange={(e) =>
                      updateFormData({ address_detail: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    placeholder="상세주소"
                  />
                </>
              ) : (
                <p className="text-lg text-gray-900">
                  {profile.postal_code && `(${profile.postal_code}) `}
                  {profile.address} {profile.address_detail}
                </p>
              )}
            </div>

            {/* 연락처 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  * 대표 연락처
                </label>
                {editMode ? (
                  <input
                    type="tel"
                    value={formData.contact_phone}
                    onChange={(e) =>
                      updateFormData({ contact_phone: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  />
                ) : (
                  <p className="text-lg text-gray-900">{profile.contact_phone}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  * 이메일
                </label>
                {editMode ? (
                  <input
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) =>
                      updateFormData({ contact_email: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  />
                ) : (
                  <p className="text-lg text-gray-900">{profile.contact_email}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: 브랜드 정보 */}
      {activeTab === "brand" && (
        <div className="bg-white rounded-lg shadow p-8">
          <div className="space-y-6">
            {/* 브랜드명 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                * 브랜드명
              </label>
              {editMode ? (
                <input
                  type="text"
                  value={formData.brand_name}
                  onChange={(e) =>
                    updateFormData({ brand_name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  placeholder="고객에게 보여질 브랜드명"
                />
              ) : (
                <p className="text-lg text-gray-900">{profile.brand_name}</p>
              )}
            </div>

            {/* 브랜드 소개 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                * 브랜드 소개
              </label>
              {editMode ? (
                <textarea
                  value={formData.brand_description}
                  onChange={(e) =>
                    updateFormData({ brand_description: e.target.value })
                  }
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  placeholder="브랜드 소개를 작성해주세요..."
                />
              ) : (
                <p className="text-lg text-gray-900 whitespace-pre-wrap">
                  {profile.brand_description}
                </p>
              )}
            </div>

            {/* 브랜드 로고 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                브랜드 로고
              </label>
              {editMode ? (
                <div className="flex items-start gap-4">
                  <label className="flex flex-col items-center justify-center w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <span className="text-3xl mb-2">📷</span>
                    <span className="text-sm text-gray-600">로고 업로드</span>
                  </label>
                  {(logoPreview || formData.brand_logo) && (
                    <img
                      src={logoPreview || formData.brand_logo}
                      alt="브랜드 로고"
                      className="w-40 h-40 object-cover rounded-lg"
                    />
                  )}
                </div>
              ) : (
                profile.brand_logo && (
                  <img
                    src={profile.brand_logo}
                    alt="브랜드 로고"
                    className="w-40 h-40 object-cover rounded-lg"
                  />
                )
              )}
            </div>

            {/* 브랜드 배너 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                브랜드 배너
              </label>
              {editMode ? (
                <div className="space-y-2">
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBannerUpload}
                      className="hidden"
                    />
                    <span className="text-3xl mb-2">🖼️</span>
                    <span className="text-sm text-gray-600">배너 업로드</span>
                  </label>
                  {(bannerPreview || formData.brand_banner) && (
                    <img
                      src={bannerPreview || formData.brand_banner}
                      alt="브랜드 배너"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  )}
                </div>
              ) : (
                profile.brand_banner && (
                  <img
                    src={profile.brand_banner}
                    alt="브랜드 배너"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                )
              )}
            </div>

            {/* SNS */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instagram
                </label>
                {editMode ? (
                  <div className="flex">
                    <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 rounded-l-lg">
                      @
                    </span>
                    <input
                      type="text"
                      value={formData.instagram}
                      onChange={(e) =>
                        updateFormData({ instagram: e.target.value })
                      }
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                ) : (
                  <p className="text-lg text-gray-900">
                    {profile.instagram ? `@${profile.instagram}` : "-"}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                {editMode ? (
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) =>
                      updateFormData({ website: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  />
                ) : (
                  <p className="text-lg text-gray-900">{profile.website || "-"}</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-800">
              💡 브랜드 정보는 공개 페이지에 표시됩니다. 축제 방문객들이 볼 수
              있습니다.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default PartnerProfile;
