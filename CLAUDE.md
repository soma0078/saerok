## 프로젝트 개요

**새록(Saerok)** — 저장한 문장(말씀, 명언, 다짐 등)을 카테고리별로 관리하고, 설정한 시간에 로컬 알림으로 반복 상기시켜주는 iOS/Android 앱.

- 플랫폼: iOS / Android
- 프레임워크: Expo (React Native, TypeScript)
- 스타일링: Uniwind (Tailwind CSS v4 for React Native)
- 배포: App Store / Google Play

상세 기획: `docs/PRD.md`, `docs/IA.md` (데이터 모델 + 네비게이션).

## 폴더 구조

```
src/
  app/                # Expo Router 라우트 (화면만)
  components/
    ui/               # Button, Text 등 atomic 컴포넌트
  hooks/              # 커스텀 훅 — 비즈니스 로직
  lib/
    storage.ts        # AsyncStorage 접근 단일 진입점
  types/
    index.ts          # 전체 타입 정의
```

## 코드 규칙

1. Storage 접근은 `lib/storage.ts`를 통해서만 — 화면·훅에서 직접 호출 금지
2. 비즈니스 로직은 `hooks/`에 — 화면 컴포넌트는 UI 렌더링과 이벤트 바인딩만 담당
3. 스타일은 Uniwind `className`만 사용 — StyleSheet 혼용 금지
4. 타입은 `types/index.ts`에서 중앙 관리 — 인라인 타입 정의 금지
5. 파일명 kebab-case, 컴포넌트명 PascalCase

## 기술 도입 규칙

새로운 기술·라이브러리·패턴 도입이 필요한 경우:

1. 선택지를 트레이드오프와 함께 비교해서 제시
2. 프로젝트 제약(Expo Go 호환, 빌드 환경 등) 사전 확인
3. 결정 받은 후 `docs/adr/NNN-제목.md`에 ADR 작성
4. ADR 작성 후 구현 진행

### ADR 형식

```markdown
# ADR-NNN: 제목

- **날짜**: YYYY-MM-DD
- **상태**: 결정됨 | 검토중 | 폐기됨

## 맥락
## 선택지
## 결정
## 이유
## 결과
```

## 커밋 규칙

1. 커밋 전 반드시 사용자 허락 받기
2. 관련 없는 변경은 커밋 분리
3. 메시지 형식:

   ```
   type: 제목 (한국어)

   - body (선택, 제목만으로 의도가 불명확할 때만 작성)
   ```

4. type: `feat` / `fix` / `chore` / `docs` / `refactor`
5. 제목은 무엇을 했는지가 아니라 왜·무엇이 변했는지 중심으로 작성
6. 자명한 변경에는 body 생략

## 기능 구현 절차

기능 구현은 아래 순서를 완료해야 한다.

1. **요구사항 파악** — PRD/IA 확인, 변경 파일 목록화
2. **구현** — 코드 규칙 준수
3. **타입 검사** — `npx tsc --noEmit` 통과 확인 및 오류 수정
4. **셀프 코드 리뷰** — 로직 버그, 엣지 케이스, 규칙 위반 여부 점검
5. **번들링 에러 확인** — dev 서버 실행 후 번들 요청을 직접 보내 에러 검사 및 수정
6. **실기기 확인** — 사용자가 Expo Go에서 골든 패스 + 주요 엣지 케이스 테스트
7. **에러 대응** — 오류 발생 시 수정 후 3번부터 재수행
8. **완료 보고** — 확인된 동작 내용 사용자에게 전달

## 트러블슈팅 규칙

이슈 해결 확인 후 `docs/TROUBLESHOOTING.md` 기록 여부를 사용자에게 묻고, 승인 시 아래 형식으로 작성:
1. 증상 (에러 메시지 포함)
2. 원인
3. 해결 방법

## 주요 명령어

```bash
npm start          # Expo 개발 서버
npm run ios        # iOS 시뮬레이터
npm run android    # Android 에뮬레이터
```
