<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { onMounted } from 'vue';
import Toast from 'primevue/toast';

const authStore = useAuthStore();

onMounted(() => {
  authStore.initializeAuth();
});
</script>

<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <Toast />
    <RouterView />
  </div>
</template>
