import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { RootState } from '@/store/store';

export default function useRedirectIfAuth() {
  const router = useRouter();
  const token = useSelector((s: RootState) => s.auth?.token);

  useEffect(() => {
    if (token) {
      router.replace('/home');
    }
  }, [token, router]);
}
