# IA — 새록 (Saerok)

## 1. 플랫폼

**iOS / Android** — Expo (React Native, TypeScript). `expo-notifications`로 로컬 알림, `AsyncStorage`로 데이터 저장.

## 2. 네비게이션 구조

React Navigation 기반.

```
App
├── [진입 조건 체크] → AsyncStorage: @saerok/onboardingCompleted, @saerok/user
│
├── Onboarding Stack (최초 1회)
│   ├── O-01: 가치 소개 슬라이드
│   ├── O-02: 기능 설명 슬라이드
│   ├── O-03: 알림 권한 요청 (필수)
│   ├── A-02: 소셜 로그인 (구글 / 애플)
│   └── O-04: 프로필 등록 (건너뛰기 가능)
│
└── Main Stack (로그인 후)
    ├── A: Home — 문장 목록 (카테고리 탭)
    ├── B: 새 문장 등록 (Modal)
    └── C: 알림 설정 (Modal or Screen)
```

### 진입 조건

```
앱 시작 시:
  if (!onboardingCompleted) → Onboarding Stack
  else if (!user)           → A-02 로그인
  else                      → Main Stack (Home)
```

## 3. 데이터 모델

### User
```ts
interface User {
  id: string;
  provider: 'google' | 'apple';
  nickname: string | null;
  profileImage: string | null;
  createdAt: string; // ISO
}
```

### Category
```ts
interface Category {
  id: string;
  name: string;
  createdAt: string;
}
```

### Verse (문장)
```ts
interface Verse {
  id: string;
  categoryId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}
```

### NotificationSettings
```ts
interface NotificationSettings {
  categoryIds: string[];         // 알림 대상 카테고리
  dailyTimes: string[];          // ["09:00", "14:30"] — HH:mm
  period: 'indefinite' | '7d' | '30d';
  startDate: string;             // ISO — 설정 저장 시점
  isActive: boolean;
}
```

## 4. AsyncStorage 키 구조

키 접두사 `@saerok/`.

| Key | 타입 | 설명 |
|-----|------|------|
| `@saerok/user` | `User` | 로그인 사용자 정보 |
| `@saerok/onboardingCompleted` | `boolean` | 온보딩 완료 여부 |
| `@saerok/categories` | `Category[]` | 전체 카테고리 목록 |
| `@saerok/verses` | `Verse[]` | 전체 문장 목록 |
| `@saerok/notificationSettings` | `NotificationSettings` | 알림 설정 |

## 5. 알림 스케줄링 로직

`NotificationSettings` 저장 시점에 기존 예약 전체 취소 후 재예약 (`expo-notifications`).

```
1. period 계산
   - indefinite: 오늘부터 365일
   - 7d / 30d: 오늘부터 N일

2. 날짜 × dailyTimes 조합으로 전체 알림 시각 목록 생성

3. 각 알림 시각마다:
   - categoryIds 중 verses가 있는 카테고리 필터링
   - 해당 카테고리의 verses에서 랜덤 1개 선택
   - expo-notifications로 로컬 알림 예약

4. 설정 변경 시: cancelAllScheduledNotificationsAsync() 후 재예약
```

## 6. 화면 → 데이터 의존 관계

| 화면 | 읽기 | 쓰기 |
|------|------|------|
| O-04 프로필 등록 | — | `@saerok/user` |
| A Home | `categories`, `verses` | — |
| B 새 문장 등록 | `categories` | `verses`, `categories` |
| C 알림 설정 | `categories`, `verses`, `notificationSettings` | `notificationSettings` |
