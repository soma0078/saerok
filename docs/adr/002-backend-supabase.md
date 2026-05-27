# ADR-002: 백엔드 서비스로 Supabase 도입

- **날짜**: 2026-05-27
- **상태**: 결정됨

## 맥락

Phase 2에서 클라우드 동기화 및 디바이스 간 데이터 공유를 지원하기 위해 서버가 필요하다.
소셜 로그인(Google, Kakao) 계정을 기준으로 사용자 데이터를 서버에 저장해야 한다.

## 선택지

| | Supabase | Firebase | 직접 구축 (NestJS + PostgreSQL) |
|---|---|---|---|
| DB | PostgreSQL (관계형) | Firestore (NoSQL) | 자유 선택 |
| Auth | Google 기본, Kakao 커스텀 OAuth | Google 기본, Kakao 커스텀 토큰 | 직접 구현 |
| 초기 공수 | 낮음 | 낮음 | 높음 |
| Kakao 연동 난이도 | 중간 | 높음 | 중간 |
| 현재 스키마 적합성 | 높음 (관계형) | 낮음 (NoSQL) | 높음 |

## 결정

**Supabase** 도입.

## 이유

- 기존 데이터 모델(User → Category → Quote)이 관계형 구조로 설계되어 있어 PostgreSQL에 자연스럽게 매핑됨
- Auth, DB, REST API가 한 세트로 제공되어 별도 서버 구축 불필요
- TypeScript 타입 자동 생성 지원으로 기존 코드와 연결 용이
- Firebase 대비 Kakao 커스텀 OAuth 연동 경로가 명확함
- 무료 티어로 MVP 검증 가능, 이후 자체 호스팅으로 전환 가능

## 결과

- `@supabase/supabase-js` 클라이언트 라이브러리 도입
- DB 스키마: `users`, `categories`, `quotes`, `notification_settings` 테이블
- Auth: Supabase Auth로 Google/Kakao 소셜 로그인 처리
- 기존 AsyncStorage 데이터 레이어(`lib/storage.ts`)는 Phase 2 전환 시 Supabase로 교체
- Phase 1 로컬 데이터 → 서버 마이그레이션 전략 별도 수립 필요
