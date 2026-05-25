import { useEffect, useState } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import { useAuthRequest, makeRedirectUri, exchangeCodeAsync } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { storage } from '@/lib/storage';
import type { User } from '@/types';

WebBrowser.maybeCompleteAuthSession();

const KAKAO_DISCOVERY = {
  authorizationEndpoint: 'https://kauth.kakao.com/oauth/authorize',
  tokenEndpoint: 'https://kauth.kakao.com/oauth/token',
};

const KAKAO_REDIRECT_URI = makeRedirectUri({ scheme: 'saerok' });

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Google 로그인 요청 생성
  const [, googleResponse, promptGoogleAsync] = Google.useAuthRequest({
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB,
  });

  // Kakao 로그인 요청 생성
  const [kakaoRequest, kakaoResponse, promptKakaoAsync] = useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_KAKAO_CLIENT_ID ?? '',
      redirectUri: KAKAO_REDIRECT_URI,
      scopes: ['profile_nickname', 'profile_image'],
      usePKCE: true,
    },
    KAKAO_DISCOVERY
  );

  // Google 로그인 응답 처리
  useEffect(() => {
    if (googleResponse?.type !== 'success') return;
    const token = googleResponse.authentication?.accessToken;
    if (!token) return;

    setIsLoading(true);
    fetch('https://www.googleapis.com/userinfo/v2/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(async (info) => {
        const newUser: User = {
          id: info.id,
          provider: 'google',
          nickname: info.name ?? null,
          profileImage: info.picture ?? null,
          createdAt: new Date().toISOString(),
        };
        await storage.user.set(newUser);
        setUser(newUser);
      })
      .finally(() => setIsLoading(false));
  }, [googleResponse]);

  // Kakao 로그인 응답 처리
  useEffect(() => {
    if (kakaoResponse?.type !== 'success' || !kakaoRequest) return;

    setIsLoading(true);
    exchangeCodeAsync(
      {
        code: kakaoResponse.params.code,
        redirectUri: KAKAO_REDIRECT_URI,
        clientId: process.env.EXPO_PUBLIC_KAKAO_CLIENT_ID ?? '',
        extraParams: kakaoRequest.codeVerifier
          ? { code_verifier: kakaoRequest.codeVerifier }
          : undefined,
      },
      KAKAO_DISCOVERY
    )
      .then((tokenResponse) =>
        fetch('https://kapi.kakao.com/v2/user/me', {
          headers: { Authorization: `Bearer ${tokenResponse.accessToken}` },
        })
      )
      .then((r) => r.json())
      .then(async (info) => {
        const newUser: User = {
          id: String(info.id),
          provider: 'kakao',
          nickname: info.kakao_account?.profile?.nickname ?? null,
          profileImage: info.kakao_account?.profile?.profile_image_url ?? null,
          createdAt: new Date().toISOString(),
        };
        await storage.user.set(newUser);
        setUser(newUser);
      })
      .finally(() => setIsLoading(false));
  }, [kakaoResponse, kakaoRequest]);

  return {
    user,
    isLoading,
    loginWithGoogle: promptGoogleAsync,
    loginWithKakao: promptKakaoAsync,
  };
}
