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

| Expo SDK | expo-router | react-native |
| -------- | ----------- | ------------ |
| 54.x     | 4.x         | ~0.76        |
| 55.x     | 55.x        | ~0.79        |
| 56.x     | 56.x        | ~0.85        |
