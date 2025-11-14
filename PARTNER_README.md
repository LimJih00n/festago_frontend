# 사업자 페이지 개발 완료 📊

## 구현된 기능

### 1. 핵심 페이지 (6개)
- **대시보드** (`/partner/dashboard`) - 📊 한눈에 보는 요약 정보
- **축제 탐색** (`/partner/festivals`) - 🎪 참여 가능한 축제 검색 및 탐색
- **내 지원 내역** (`/partner/applications`) - 📋 지원서 관리 및 상태 확인
- **프로필 관리** (`/partner/profile`) - 🏢 사업자 프로필 정보
- **메시지** (`/partner/messages`) - 💬 주최자와의 소통
- **데이터 분석** (`/partner/analytics`) - 📈 성과 데이터 (추후 고도화 예정)

### 2. 레이아웃 컴포넌트
- **PartnerSidebar** - 사이드바 내비게이션
- **PartnerLayout** - 사업자 페이지 전용 레이아웃

### 3. API 연동
- `src/api/partner.js` - 모든 사업자 관련 API 엔드포인트

## 디렉토리 구조

```
festago-frontend/src/
├── api/
│   └── partner.js              # 사업자 API
├── components/
│   └── partner/
│       └── PartnerSidebar.jsx  # 사이드바
└── pages/
    └── partner/
        ├── PartnerDashboard.jsx   # 대시보드
        ├── FestivalBrowse.jsx      # 축제 탐색
        ├── MyApplications.jsx      # 내 지원 내역
        ├── PartnerProfile.jsx      # 프로필 관리
        ├── Messages.jsx            # 메시지
        └── Analytics.jsx           # 데이터 분석
```

## 라우팅 구조

```
/partner/*               # 사업자 영역 (사이드바 레이아웃)
  ├── /                  # 대시보드 (기본)
  ├── /dashboard         # 대시보드
  ├── /festivals         # 축제 탐색
  ├── /applications      # 내 지원 내역
  ├── /profile           # 프로필 관리
  ├── /analytics         # 데이터 분석
  └── /messages          # 메시지
```

## 주요 기능

### 대시보드
- 지원 중/승인됨/완료 통계 카드
- 최근 알림 (메시지, 승인/거절)
- 다가오는 일정 (승인된 축제)
- 빠른 작업 링크

### 축제 탐색
- 검색 기능
- 축제 카드 목록
- 이미 지원한 축제 표시
- 지원하기 버튼

### 내 지원 내역
- 상태별 필터링 (전체/대기중/승인됨/거절됨/완료)
- 지원서 상세 정보
- 주최자 메시지 표시
- 거절 사유 표시

### 프로필 관리
- 브랜드 정보 표시
- 통계 (총 지원/승인/승인률)

### 메시지
- 받은 메시지 목록
- 읽지 않은 메시지 개수
- 새 메시지 강조 표시

## 다음 단계

### Phase 2 (추가 기능)
1. **축제 지원서 작성 폼** - 4단계 지원서 작성 UI
2. **데이터 분석 고도화** - 차트, 그래프, AI 리뷰 분석
3. **브랜드 공개 페이지** - 일반 유저가 볼 수 있는 브랜드 페이지
4. **프로필 수정 기능** - 브랜드 정보 편집
5. **메시지 작성/답장** - 메시지 작성 및 답장 기능
6. **이미지 업로드** - AWS S3 연동

## 테스트 방법

1. Backend 서버 실행:
```bash
cd festago-backend
venv/Scripts/python.exe manage.py runserver
```

2. Frontend 서버 실행:
```bash
cd festago-frontend
npm run dev
```

3. 사업자 페이지 접속:
```
http://localhost:5173/partner/dashboard
```

## 참고
- 마스터 플랜: `docs/사업자_master.md`
- Backend API: `festago-backend/partners/`
- Frontend 구현: Phase 1 (핵심 기능) 완료
