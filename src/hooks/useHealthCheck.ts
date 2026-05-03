import { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { publicApi } from '@/services/api';

type HealthState = {
  healthy: boolean;
  lastCheckedAt: number | null;
  lastError?: string | null;
};

export default function useHealthCheck(intervalMs = 120000) {
  const [state, setState] = useState<HealthState>({ healthy: true, lastCheckedAt: null, lastError: null });
  const mounted = useRef(true);
  const timer = useRef<number | null>(null);

  const check = async () => {
    try {
      const res = await publicApi.get('/public/status');
      // Expect stable response like { Code:200, Message: 'Server health ok!' }
      const ok = res?.data?.Code === 200 || res.status === 200;
      if (!mounted.current) return;
      setState({ healthy: ok, lastCheckedAt: Date.now(), lastError: ok ? null : JSON.stringify(res?.data) });
    } catch (err: any) {
      // treat network / 5xx as unhealthy
      const message = err?.response?.status ? `HTTP ${err.response.status}` : err?.message || 'network error';
      if (!mounted.current) return;
      setState({ healthy: false, lastCheckedAt: Date.now(), lastError: message });
    }
  };

  useEffect(() => {
    mounted.current = true;
    // initial check
    check();

    // polling
    timer.current = setInterval(() => check(), intervalMs) as unknown as number;

    const sub = AppState.addEventListener('change', (next) => {
      if (next === 'active') {
        check();
      }
    });

    return () => {
      mounted.current = false;
      if (timer.current) clearInterval(timer.current as unknown as number);
      sub.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intervalMs]);

  return {
    healthy: state.healthy,
    lastCheckedAt: state.lastCheckedAt,
    lastError: state.lastError,
    recheck: check,
  } as const;
}
