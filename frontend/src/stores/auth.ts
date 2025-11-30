import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authApi } from '@/api/auth';
import { usersApi } from '@/api/users';
import type { User, RegisterData, LoginData } from '@/types/user';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const accessToken = ref<string | null>(localStorage.getItem('accessToken'));
  const refreshToken = ref<string | null>(
    localStorage.getItem('refreshToken')
  );
  const loading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!accessToken.value && !!user.value);

  const setTokens = (access: string, refresh: string) => {
    accessToken.value = access;
    refreshToken.value = refresh;
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
  };

  const clearTokens = () => {
    accessToken.value = null;
    refreshToken.value = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  const register = async (data: RegisterData) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await authApi.register(data);
      user.value = response.user;
      setTokens(response.tokens.accessToken, response.tokens.refreshToken);
      return true;
    } catch (err: any) {
      error.value =
        err.response?.data?.message || 'Registration failed. Please try again.';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const login = async (data: LoginData) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await authApi.login(data);
      user.value = response.user;
      setTokens(response.tokens.accessToken, response.tokens.refreshToken);
      return true;
    } catch (err: any) {
      error.value =
        err.response?.data?.message || 'Login failed. Please try again.';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    user.value = null;
    clearTokens();
  };

  const fetchCurrentUser = async () => {
    if (!accessToken.value) return;

    loading.value = true;
    error.value = null;
    try {
      user.value = await usersApi.getCurrentUser();
    } catch (err: any) {
      error.value = 'Failed to fetch user data';
      clearTokens();
      user.value = null;
    } finally {
      loading.value = false;
    }
  };

  const initializeAuth = async () => {
    if (accessToken.value && !user.value) {
      await fetchCurrentUser();
    }
  };

  return {
    user,
    accessToken,
    refreshToken,
    loading,
    error,
    isAuthenticated,
    register,
    login,
    logout,
    fetchCurrentUser,
    initializeAuth,
  };
});
