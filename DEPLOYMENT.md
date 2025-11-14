# Festago Frontend Deployment Guide

## Netlify 배포 가이드

### 1. Netlify에 프로젝트 연결

1. [Netlify](https://www.netlify.com/)에 로그인
2. "New site from Git" 클릭
3. GitHub 저장소 선택: `festago_frontend`
4. 빌드 설정:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Branch**: `main`

### 2. 환경변수 설정

Netlify Dashboard > Site settings > Environment variables에서 다음 변수 추가:

```
VITE_API_URL=https://your-backend-url.cloudtype.app
```

### 3. 배포 설정 파일

프로젝트 루트에 `netlify.toml` 파일이 있습니다:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 4. 배포

1. GitHub에 코드 푸시
2. Netlify가 자동으로 빌드 및 배포
3. 배포 완료 후 제공된 URL로 접속

### 로컬 개발 환경 설정

`.env` 파일 생성:

```bash
VITE_API_URL=http://localhost:8000
```

## 주요 환경변수

- `VITE_API_URL`: 백엔드 API 주소 (필수)
- `VITE_KAKAO_MAP_KEY`: 카카오맵 API 키 (선택)

## 빌드 확인

로컬에서 프로덕션 빌드 테스트:

```bash
npm run build
npm run preview
```
