# 새록 (Saerok)

저장한 문장(말씀, 명언, 다짐 등)을 카테고리별로 관리하고, 설정한 시간에 로컬 알림으로 반복 상기시켜주는 iOS/Android 앱.

## 구조

Expo (React Native, TypeScript) 단일 프로젝트.

```
saerok/
├── App.tsx          # 진입점
├── app.json         # Expo 앱 설정
├── index.ts
├── assets/          # 아이콘, 스플래시
├── docs/
│   ├── PRD.md       # 제품 요구사항
│   ├── feature.md   # 기능 정의 및 화면 설계
│   └── IA.md        # 데이터 모델 및 네비게이션 구조
└── tsconfig.json
```

## 시작하기

```bash
npm install
npm start          # Expo 개발 서버
```

### 플랫폼별 실행

```bash
npm run ios        # iOS 시뮬레이터
npm run android    # Android 에뮬레이터
```

## 주요 특징

- **완전 오프라인** — 서버 없음. 모든 데이터는 디바이스 AsyncStorage에 로컬 저장
- **로컬 알림** — `expo-notifications`로 알림 예약, 인터넷 불필요
- **카테고리 관리** — 문장을 카테고리별로 분류하여 알림 대상 지정
- **유연한 스케줄링** — 무기한 / 7일 / 30일, 하루 여러 시간 설정 가능
