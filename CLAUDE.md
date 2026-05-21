## 프로젝트 개요

**새록(Saerok)** — 저장한 문장(말씀, 명언, 다짐 등)을 카테고리별로 관리하고, 설정한 시간에 로컬 알림으로 반복 상기시켜주는 iOS/Android 앱.

- 플랫폼: iOS / Android
- 프레임워크: Expo (React Native, blank-typescript)
- 배포: App Store / Google Play

상세 기획: `docs/feature.md` (기능 정의 + 화면 설계), `docs/PRD.md`, `docs/IA.md` (데이터 모델 + 네비게이션).

## 주요 명령어

```bash
npm start          # Expo 개발 서버
npm run ios        # iOS 시뮬레이터
npm run android    # Android 에뮬레이터
```

## 아키텍처

### 데이터 저장

서버 없음. 모든 데이터는 디바이스 AsyncStorage에 로컬 저장. 키 접두사 `@saerok/`.

| Key | 타입 |
|-----|------|
| `@saerok/user` | `User` |
| `@saerok/onboardingCompleted` | `boolean` |
| `@saerok/categories` | `Category[]` |
| `@saerok/verses` | `Verse[]` |
| `@saerok/notificationSettings` | `NotificationSettings` |

핵심 타입 정의는 `docs/IA.md` §3 참고.

### 앱 진입 조건

```
onboardingCompleted 없음          → Onboarding Stack
onboardingCompleted 있고 user 없음 → 로그인 화면 (A-02)
둘 다 있음                         → Main Stack (Home)
```

### 알림 스케줄링

`NotificationSettings` 저장 시점에 `cancelAllScheduledNotificationsAsync()` 후 재예약 (`expo-notifications`).

- `indefinite` → 오늘부터 365일치 예약
- `7d` / `30d` → 오늘부터 해당 일수만 예약
- 날짜 × `dailyTimes` 조합 → 각 시각마다 대상 카테고리에서 랜덤 verse 1개
