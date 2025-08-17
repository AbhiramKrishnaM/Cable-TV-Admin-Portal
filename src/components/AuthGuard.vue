<template>
  <div
    v-if="isLoading"
    class="min-h-screen bg-gray-100 flex items-center justify-center"
  >
    <div class="text-center">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"
      ></div>
      <p class="mt-4 text-gray-600">Loading...</p>
    </div>
  </div>

  <div
    v-else-if="!isAuthenticated"
    class="min-h-screen bg-gray-100 flex items-center justify-center"
  >
    <div class="text-center">
      <div
        class="mx-auto h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mb-4"
      >
        <svg
          class="h-6 w-6 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
      <p class="text-gray-600 mb-4">
        You need to be authenticated to access this page.
      </p>
      <router-link
        to="/login"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Sign In
      </router-link>
    </div>
  </div>

  <slot v-else />
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const authStore = useAuthStore();

const isLoading = ref(true);
const isAuthenticated = computed(() => authStore.isAuthenticated);

onMounted(async () => {
  try {
    // Check if user is authenticated
    if (!authStore.isAuthenticated) {
      const isAuth = await authStore.checkAuth();
      if (!isAuth) {
        router.push("/login");
        return;
      }
    }
  } catch (error) {
    console.error("Auth check failed:", error);
    router.push("/login");
  } finally {
    isLoading.value = false;
  }
});
</script>
