# 페스타고 Frontend (React + Vite)

**프로젝트**: 페스타고 - 지역 축제 플랫폼
**기술 스택**: React 18 + Vite + Tailwind CSS + Axios

---

## 🚀 빠른 시작

### 1. 패키지 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

서버가 실행되면: http://localhost:5173

---

## 📋 사전 준비

Frontend를 실행하기 전에 **Backend가 먼저 실행**되어 있어야 합니다!

```bash
# Backend 실행 (다른 터미널에서)
cd ../festago-backend
python manage.py runserver
```

Backend가 http://localhost:8000에서 실행 중이어야 합니다.

---

## 🎨 화면 구성

### 1. 홈페이지 (/)
- 축제 목록 카드
- 카테고리 필터 (축제/공연/전시/팝업)
- 검색 기능

### 2. 상세 페이지 (/events/:id)
- 축제 상세 정보
- 포스터 이미지
- 날짜, 위치, 설명
- 공식 웹사이트 링크

---

## 🔌 API 연동

Backend와 통신하는 Axios 설정이 되어 있습니다:

```javascript
// src/api/axios.js
baseURL: 'http://localhost:8000'
```

**주요 API:**
- `GET /api/events/` - 이벤트 목록
- `GET /api/events/:id/` - 이벤트 상세
- `GET /api/events/map/` - 지도용 데이터

---

## 🎨 Tailwind CSS

Tailwind CSS가 설정되어 있어 유틸리티 클래스를 바로 사용할 수 있습니다:

```jsx
<div className="bg-blue-600 text-white p-4 rounded-lg">
  Hello Tailwind!
</div>
```

---

## 📁 프로젝트 구조

```
festago-frontend/
├── public/              # 정적 파일
├── src/
│   ├── api/            # API 통신
│   │   ├── axios.js    # Axios 설정
│   │   ├── events.js   # 이벤트 API
│   │   └── auth.js     # 인증 API
│   ├── pages/          # 페이지 컴포넌트
│   │   ├── HomePage.jsx
│   │   └── EventDetailPage.jsx
│   ├── components/     # 재사용 컴포넌트
│   ├── utils/          # 유틸리티
│   │   └── store.js    # Zustand 스토어
│   ├── App.jsx         # 메인 앱
│   ├── main.jsx        # 엔트리 포인트
│   └── index.css       # 글로벌 CSS
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## 🛠️ 사용 기술

### Core
- **React 18.3** - UI 라이브러리
- **Vite 5.4** - 빌드 도구
- **React Router 6.26** - 라우팅

### State Management
- **Zustand 5.0** - 상태 관리

### HTTP Client
- **Axios 1.7** - API 통신

### Styling
- **Tailwind CSS 3.4** - 유틸리티 CSS

---

## 📝 npm Scripts

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 미리보기
npm run preview
```

---

## 🧪 테스트 시나리오

### 1. 축제 목록 확인
1. http://localhost:5173 접속
2. 30개 축제 카드 표시 확인
3. 카테고리 필터 클릭 (축제/공연/전시/팝업)
4. 검색 기능 테스트

### 2. 상세 페이지
1. 축제 카드 클릭
2. 상세 정보 표시 확인
3. 뒤로가기 버튼 동작 확인

### 3. API 연동
1. 개발자 도구 (F12) → Network 탭
2. XHR/Fetch 필터 선택
3. API 요청/응답 확인

---

## 🐛 트러블슈팅

### Backend 연결 실패
```
Error: connect ECONNREFUSED ::1:8000
```

**해결**: Backend가 실행 중인지 확인
```bash
cd ../festago-backend
python manage.py runserver
```

### CORS 에러
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**해결**: Backend의 `settings.py`에서 CORS 설정 확인
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]
```

### 데이터가 비어있음
```
검색 결과가 없습니다.
```

**해결**: Backend에서 fixtures 로드
```bash
cd ../festago-backend
python manage.py loaddata fixtures/events.json
```

---

## 🚀 배포 (Netlify)

### 1. 빌드
```bash
npm run build
```

### 2. Netlify 배포
- Build command: `npm run build`
- Publish directory: `dist`

### 3. 환경 변수 설정
```
VITE_API_BASE_URL=https://your-backend.onrender.com
```

---

## 💡 다음 단계

현재 구현된 기능:
- ✅ 축제 목록 조회
- ✅ 카테고리 필터
- ✅ 검색 기능
- ✅ 상세 페이지

추가할 기능:
- ⬜ 로그인/회원가입 페이지
- ⬜ 지도 페이지 (카카오맵)
- ⬜ 북마크 기능
- ⬜ 사업자 프로필 페이지

---

## 📚 문서

- React: https://react.dev/
- Vite: https://vitejs.dev/
- Tailwind CSS: https://tailwindcss.com/
- Axios: https://axios-http.com/

---

**작성자**: Claude
**생성일**: 2025-10-27
