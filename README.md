
# BurgundyFlix (pb-assignment-02)

TMDB(The Movie Database) API를 활용한 영화 탐색 웹앱입니다.  
Home/Popular/Search/Wishlist 페이지로 구성되어 있으며, 포스터 중심의 정돈된 UI와 라이트/다크 테마(시스템 + 수동 토글)를 지원합니다.

## Demo
- GitHub Pages: https://one2-3.github.io/PB_homework2/

---

## Tech Stack
- Vue 3 + TypeScript + Vite
- Vue Router
- Pinia (상태관리)
- Axios (HTTP)
- LocalStorage (로그인 유지/위시리스트/테마 저장)

---

## Features (Page Requirements)

### 1) Signin (로그인/회원가입)
- 이메일/비밀번호 기반 로그인/회원가입 UI
- **비밀번호 입력값을 TMDB API Key로 사용**하여 TMDB API 호출 권한을 확보
- 로그인 유지(remember me) 선택 가능
- 라이트/다크 테마 토글 지원

> TMDB API Key는 TMDB 사이트의 `Settings > API`에서 확인할 수 있습니다.

### 2) Home
- TMDB 데이터를 활용한 영화 섹션 4개 구성 (예: Now Playing / Popular / Top Rated / Upcoming)
- 포스터 중심 레이아웃

### 3) Popular
- 2가지 보기 제공
  - Table 모드: 스크롤 없이 페이지 단위로 탐색 + 포스터 포함
  - Infinite 모드: 무한 스크롤로 추가 로딩

### 4) Search
- 검색 + 필터 제공
  - 키워드
  - 장르
  - 최소 평점
  - 연도
  - 정렬 옵션
- Reset 기능 제공

### 5) Wishlist
- 영화 찜(저장/해제)
- **LocalStorage only**로 저장(서버 저장 없음)

---

## Installation & Run

### 1) Install
```bash
npm install
````

### 2) Dev Server

```bash
npm run dev
```

### 3) Build

```bash
npm run build
```

### 4) Preview

```bash
npm run preview
```

---

## Environment / API Key 안내

* 본 프로젝트는 TMDB API Key가 필요합니다.
* 로그인/회원가입 화면에서 **비밀번호에 TMDB API Key(32자리)**를 입력하면, 이후 TMDB API 요청이 가능해집니다.

---

## Project Structure

```txt
pb-assignment-02/
├─ public/
├─ src/
│  ├─ assets/
│  ├─ components/
│  │  ├─ layout/        # Header 등 레이아웃 컴포넌트
│  │  ├─ movie/         # MovieCard, MovieRow 등
│  │  └─ ui/            # LoadingSpinner 등 공용 UI
│  ├─ composables/      # 공용 훅 (localStorage 등)
│  ├─ pages/            # 페이지 컴포넌트(Home/Popular/Search/Signin/Wishlist)
│  ├─ router/           # 라우팅 설정
│  ├─ services/         # TMDB API client/endpoint
│  ├─ stores/           # Pinia store(auth/ui/wishlist)
│  ├─ styles/           # tokens.css, ui.css
│  ├─ types/            # TMDB 타입 정의
│  ├─ App.vue
│  └─ main.ts
├─ vite.config.ts
└─ package.json
```

---

## Coding Convention (Optional)

* 컴포넌트: `PascalCase.vue`
* composable/store/service: `camelCase.ts`
* 한 파일에 역할 하나(페이지/컴포넌트/서비스 분리)

---

## Git Commit Message Rule (Optional)

* `feat:` 기능 추가
* `fix:` 버그 수정
* `chore:` 설정/빌드/리팩터링
* `docs:` 문서 수정

예)

* `feat: add theme toggle`
* `fix: normalize pages folder casing`

---

## Deployment (GitHub Pages)

* GitHub Actions를 통해 `main` 브랜치 push 시 자동 배포됩니다.

```

