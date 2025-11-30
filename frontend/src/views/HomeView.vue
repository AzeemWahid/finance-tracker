<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import Button from 'primevue/button';
import Card from 'primevue/card';

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<template>
  <div class="min-h-screen">
    <!-- Navigation -->
    <nav class="bg-white shadow-md">
      <div class="container mx-auto px-4 py-4">
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-bold text-blue-600">My App</h1>
          <div class="flex gap-2">
            <template v-if="authStore.isAuthenticated">
              <router-link to="/dashboard">
                <Button label="Dashboard" severity="secondary" />
              </router-link>
              <Button
                label="Logout"
                severity="danger"
                @click="handleLogout"
              />
            </template>
            <template v-else>
              <router-link to="/login">
                <Button label="Login" />
              </router-link>
              <router-link to="/register">
                <Button label="Register" severity="secondary" />
              </router-link>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <div class="container mx-auto px-4 py-16">
      <div class="text-center max-w-3xl mx-auto">
        <h1 class="text-5xl font-bold mb-6">Welcome to Your App</h1>
        <p class="text-xl text-gray-600 mb-8">
          A modern full-stack application built with Vue 3, Express, TypeScript,
          and PostgreSQL
        </p>
        <div class="flex gap-4 justify-center">
          <router-link to="/register" v-if="!authStore.isAuthenticated">
            <Button label="Get Started" size="large" />
          </router-link>
          <router-link to="/dashboard" v-else>
            <Button label="Go to Dashboard" size="large" />
          </router-link>
        </div>
      </div>

      <!-- Features Section -->
      <div class="grid md:grid-cols-3 gap-6 mt-16">
        <Card>
          <template #title>
            <div class="flex items-center gap-2">
              <i class="pi pi-lock text-2xl"></i>
              <span>Secure Authentication</span>
            </div>
          </template>
          <template #content>
            <p class="text-gray-600">
              JWT-based authentication with access and refresh tokens for secure
              user sessions
            </p>
          </template>
        </Card>

        <Card>
          <template #title>
            <div class="flex items-center gap-2">
              <i class="pi pi-database text-2xl"></i>
              <span>PostgreSQL Database</span>
            </div>
          </template>
          <template #content>
            <p class="text-gray-600">
              Robust data storage with stored procedures for optimized database
              operations
            </p>
          </template>
        </Card>

        <Card>
          <template #title>
            <div class="flex items-center gap-2">
              <i class="pi pi-code text-2xl"></i>
              <span>TypeScript</span>
            </div>
          </template>
          <template #content>
            <p class="text-gray-600">
              Full type safety across frontend and backend for better developer
              experience
            </p>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>
