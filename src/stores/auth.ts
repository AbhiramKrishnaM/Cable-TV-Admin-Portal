import { defineStore } from "pinia";
import { ref, computed } from "vue";
import axios from "axios";

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem("token"));
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!token.value && !!user.value);
  const isAdmin = computed(() => user.value?.role === "admin");

  // Set auth header for all requests
  if (token.value) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token.value}`;
  }

  const login = async (credentials: LoginCredentials) => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        credentials
      );
      const { token: newToken, user: userData } = response.data;

      token.value = newToken;
      user.value = userData;

      localStorage.setItem("token", newToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

      return { success: true };
    } catch (err: any) {
      error.value = err.response?.data?.message || "Login failed";
      return { success: false, error: error.value };
    } finally {
      isLoading.value = false;
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await axios.post(
        "http://localhost:3000/api/auth/register",
        credentials
      );
      const { token: newToken, user: userData } = response.data;

      token.value = newToken;
      user.value = userData;

      localStorage.setItem("token", newToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

      return { success: true };
    } catch (err: any) {
      error.value = err.response?.data?.message || "Registration failed";
      return { success: false, error: error.value };
    } finally {
      isLoading.value = false;
    }
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
  };

  const checkAuth = async () => {
    if (!token.value) return false;

    try {
      const response = await axios.get("http://localhost:3000/api/auth/me");
      user.value = response.data.user;
      return true;
    } catch (err) {
      logout();
      return false;
    }
  };

  const clearError = () => {
    error.value = null;
  };

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    checkAuth,
    clearError,
  };
});
