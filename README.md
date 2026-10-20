# 🏫 교직원 마이크로 바이브 미니홈피
> 교직원들이 학교 업무 및 수업 관련 AI, 자동화 아이디어를 제안·투표하고 바이브 코딩 웹앱 결과를 공유하는 2000년대 싸이월드 감성 레트로 소통 플랫폼

---

## 🚀 빠른 시작 (Local Development)

### 1. 패키지 설치
```bash
npm install
```

### 2. 개발 서버 실행
```bash
npm run dev
```
- 브라우저에서 `http://localhost:3000`으로 접속합니다.
- 풀스택 Express 서버와 Vite 개발 환경이 동시에 실행됩니다.

### 3. 프로덕션 빌드
```bash
npm run build
npm run start
```

---

## 📦 GitHub에 프로젝트 업로드하는 방법

다운로드받은 압축 파일의 압축을 푼 폴더(터미널)에서 아래 명령어를 순서대로 실행하세요:

```bash
# 1. 깃 저장소 초기화
git init

# 2. 모든 파일 스테이징
git add .

# 3. 첫 번째 커밋 생성
git commit -m "feat: 교직원 마이크로 바이브 미니홈피 첫 커밋"

# 4. 기본 브랜치 이름을 main으로 지정
git branch -M main

# 5. GitHub에서 만든 새 레포지토리 주소 연결
# (예: https://github.com/내아이디/school-vibe-hompy.git)
git remote add origin <내_깃허브_레포지토리_URL>

# 6. GitHub으로 푸시
git push -u origin main
```

---

## 📂 프로젝트 구조

- `server.ts`: Express 풀스택 백엔드 (아이디어 CRUD, 공감 투표, CSV 내보내기, Vite 미들웨어)
- `server/data/store.json`: 교직원 아이디어 및 바이브 코딩 앱 데이터 영속 저장소
- `src/App.tsx`: 미니홈피 전체 메인 프레임 및 라우팅
- `src/components/HeaderBar.tsx`: 상단 BGM 플레이어 및 Today/Total 방문자 카운터
- `src/components/LeftSidebar.tsx`: 프로필 룸, 상태 메시지, 바로가기
- `src/components/RightTabs.tsx`: 우측 돌출형 미니홈피 네비게이션 탭 (홈/모아보기/구현/운영자)
- `src/components/HomeView.tsx`: 인사말 배너, 아이디어 작성 폼, 실시간 공감 랭킹 TOP 전광판
- `src/components/ArchiveView.tsx`: 카테고리 필터, 실시간 검색, 최신/공감순 정렬, 페이지네이션
- `src/components/GalleryView.tsx`: 바이브 코딩으로 제작된 웹앱 쇼케이스 (운영자 등록/수정/삭제)
- `src/components/AdminView.tsx`: 구글 계정 인증 (`t2501@icheonhs.goeic.kr`), 글 삭제, UTF-8 BOM CSV 다운로드
- `src/components/FooterBar.tsx`: 하단 푸터 및 운영자 간편 진입 링크

---

## 🛠 기술 스택
- **Frontend**: React 19, TypeScript, Tailwind CSS, Motion, Lucide Icons, Canvas-Confetti
- **Backend**: Express, TSX, Node.js File System Persistence
- **Tooling**: Vite
