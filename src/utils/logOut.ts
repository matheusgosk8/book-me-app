import * as SecureStore from 'expo-secure-store';
import { store } from '@/store/store';
import { clearAuth } from '@/store/slices/authSlice';

/**
 * Perform client-side logout:
 * - remove refresh and access tokens from SecureStore
 * - clear auth state from Redux
 */
export default async function logout() {
  try {
    await SecureStore.deleteItemAsync('refreshToken');
  } catch (e) {
    console.warn('[logout] failed to delete refreshToken', e);
  }
  try {
    await SecureStore.deleteItemAsync('accessToken');
  } catch (e) {
    // optional
  }
  try {
    store.dispatch(clearAuth());
  } catch (e) {
    console.warn('[logout] failed to clear auth in store', e);
  }
}
