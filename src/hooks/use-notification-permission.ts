import { useCallback, useEffect, useState } from 'react';
import { AppState } from 'react-native';
import * as Notifications from 'expo-notifications';

type PermissionStatus = 'undetermined' | 'granted' | 'denied';

export function useNotificationPermission() {
  const [status, setStatus] = useState<PermissionStatus>('undetermined');

  // 권한 상태 확인 함수
  const check = useCallback(async () => {
    const result = await Notifications.getPermissionsAsync();
    setStatus(result.status as PermissionStatus);
  }, []);

  // 앱이 활성화될 때마다 권한 상태를 확인
  useEffect(() => {
    check();
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') check();
    });
    return () => sub.remove();
  }, [check]);

  // 권한 요청 함수
  const request = async (): Promise<PermissionStatus> => {
    const result = await Notifications.requestPermissionsAsync();
    setStatus(result.status as PermissionStatus);
    return result.status as PermissionStatus;
  };

  return { status, request };
}
