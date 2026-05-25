# ADR-001: 소셜 로그인 라이브러리 선택

- **날짜**: 2026-05-25
- **상태**: 결정됨

## 맥락

F-AUTH (구글/카카오 소셜 로그인) 구현을 위해 라이브러리를 선택해야 한다.
프로젝트는 Expo Go 호환을 유지해야 한다 (별도 네이티브 빌드 환경 없음).

## 선택지

| | expo-auth-session | 네이티브 SDK |
|---|---|---|
| Expo Go 호환 | ✅ | ❌ (커스텀 dev client 필요) |
| 지원 플랫폼 | Google, Kakao 모두 OAuth 2.0 | 각 플랫폼 전용 |
| 로그인 UX | 외부 브라우저 플로우 | 네이티브 다이얼로그 |
| 추가 빌드 설정 | 불필요 | EAS Build 필요 |

네이티브 SDK 후보: `@react-native-google-signin/google-signin`, `react-native-kakao-login`

## 결정

**`expo-auth-session` + `expo-web-browser` + `expo-crypto`** 채택.

## 이유

- Expo Go 호환 유지가 현재 개발 환경의 핵심 제약
- Kakao는 네이티브 SDK도 내부적으로 브라우저를 사용하므로 UX 차이 미미
- 세 패키지 모두 Expo 공식 패키지로 SDK 54 호환 확인됨

## 결과

- 로그인 시 외부 브라우저가 열렸다 닫히는 흐름 (표준 OAuth UX)
- App Store / Google Play 배포 시에도 동일 흐름 유지
- 향후 네이티브 UX가 필요해지면 EAS Build 전환 후 네이티브 SDK로 교체 가능
