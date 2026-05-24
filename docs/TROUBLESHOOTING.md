# Troubleshooting

## Uniwind className TypeScript 오류

**증상**

```
No overload matches this call.
Type '{ children: Element[]; className: string; }' is not assignable to type 'IntrinsicAttributes & ...'
```

**원인**

Uniwind의 `className` prop 타입 선언이 TypeScript에 등록되지 않은 상태.

**해결**

`tsconfig.json`의 `compilerOptions.types`에 `"uniwind/types"` 추가:

```json
{
  "compilerOptions": {
    "types": ["uniwind/types"]
  }
}
```

이후 VS Code에서 `Cmd+Shift+P` → `TypeScript: Restart TS Server`.

---

## Expo Go 실행 시 JSI TypeError / Bundling failed

**증상**

```
Exception in HostFunction: TypeError: expected dynamic type 'boolean', but had type 'string'
```

또는

```
Unable to resolve "expo-linking" from "node_modules/expo-router/..."
```

**원인**

Expo SDK 54 + expo-router 6.x 버전 불일치. expo-router는 SDK 56부터 버전 넘버링이 Expo SDK와 일치하도록 변경됨 (6.x → 56.x). 구 SDK에 신버전 expo-router를 설치하면 의존성 충돌 발생.

- `react-native-screens@4.x`는 `react-native >= 0.82.0` 요구
- Expo Go (최신)는 New Architecture를 강제 → 버전 불일치 시 JSI 타입 오류
- `expo-linking`이 expo-router의 peer dependency인데 별도 설치 필요

**해결**

Expo SDK, expo-router, react-native를 일관된 버전으로 업그레이드:

```bash
npm install expo@^56.0.3 expo-router@^56.2.5 react-native@^0.85.3 --legacy-peer-deps
npx expo install expo-linking --legacy-peer-deps
npm start -- --clear
```

**참고 — 버전 대응표**

| Expo SDK | expo-router | react-native | react-native-screens |
| -------- | ----------- | ------------ | -------------------- |
| 54.x     | ~6.x        | ~0.81.5      | ~4.16.0              |
| 56.x     | 56.x        | ~0.85        | ~4.25.x              |

---

## Expo Go SDK 54 호환을 위한 전체 다운그레이드 절차

Expo Go 앱이 지원하는 SDK 버전과 프로젝트 SDK 버전이 다를 경우 Expo Go에서 실행 불가. 아래는 SDK 56 → SDK 54 다운그레이드 절차.

**1단계 — expo 버전 고정 후 의존성 재정렬**

```bash
npm install expo@54.0.34 --legacy-peer-deps
npx expo install --fix
# peer conflict 발생 시:
npm install expo-linking@~8.0.12 expo-router@~6.0.23 expo-splash-screen@~31.0.13 react@19.1.0 react-dom@19.1.0 react-native@0.81.5 "react-native-safe-area-context@~5.6.0" --legacy-peer-deps
npm install "@types/react@~19.1.10" "typescript@~5.9.2" --legacy-peer-deps --save-dev
```

**2단계 — react-native-screens 버전 고정** (아래 별도 항목 참고)

**3단계 — app.json에서 `newArchEnabled` 제거**

`newArchEnabled: false`로 설정하면 아래 워닝이 발생하며 실제로 효과가 없음:

```
React Native's New Architecture is always enabled in Expo Go,
but it is explicitly disabled in your app config.
New Architecture will be enabled when running in Expo Go.
```

Expo Go는 SDK 52 이후 New Architecture를 항상 강제하므로, `newArchEnabled` 설정 자체를 `app.json`에서 제거하는 것이 올바른 처리.

---

## expo-status-bar config plugin 오류 (Node.js 22 + SDK 54)

**증상**

```
PluginError: Unable to resolve a valid config plugin for expo-status-bar.
No "app.plugin.js" file found in expo-status-bar.
ERR_UNSUPPORTED_NODE_MODULES_TYPE_STRIPPING
```

**원인**

`expo-status-bar@3.x`(SDK 54 대응 버전)는 `app.plugin.js` 없이 `.ts` 소스를 직접 노출. Node.js 22는 `node_modules` 내 `.ts` 파일의 타입 제거를 지원하지 않아 플러그인 로드 실패. 빌드 오류가 아닌 config plugin 해석 오류.

**해결**

소스 코드에서 미사용 패키지이므로 `app.json` plugins와 `dependencies`에서 모두 제거:

```json
// app.json — plugins에서 "expo-status-bar" 제거
"plugins": ["expo-splash-screen", "expo-router"]
```

```bash
npm uninstall expo-status-bar --legacy-peer-deps
```

---

## react-native-screens 버전 충돌로 인한 JSI TypeError (SDK 54)

**증상**

Expo Go에서 앱 로드 시 JSI TypeError 또는 번들링 실패.

**원인**

`npx expo install --fix`가 설치하는 `react-native-screens` 최신 버전(4.25.x+)은 peer dependency로 `react-native >= 0.82.0`을 요구하지만, SDK 54의 react-native는 `0.81.5`. Expo Go SDK 54에 내장된 네이티브 모듈은 `~4.16.0` 기준이므로 JS 레이어(4.25.x)와 네이티브 레이어(4.16.x) 간 불일치 발생.

**해결**

SDK 54 기대 버전(`~4.16.0`)으로 고정. 이 버전은 peer dep이 `*`이므로 react-native 버전 제한 없음:

```bash
npm install "react-native-screens@~4.16.0" --legacy-peer-deps
```

`npx expo install --fix` 이후에도 이 버전이 올라가지 않도록 `package.json`에 명시 필요.
