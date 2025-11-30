<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useToast } from 'primevue/usetoast';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';

const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

const email = ref('');
const password = ref('');

const handleLogin = async () => {
  try {
    await authStore.login({
      email: email.value,
      password: password.value,
    });
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Login successful!',
      life: 3000,
    });
    router.push('/dashboard');
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.response?.data?.message || 'Login failed',
      life: 3000,
    });
  }
};
</script>

<template>
  <div class="flex items-center justify-center min-h-screen px-4">
    <Card class="w-full max-w-md">
      <template #title>
        <h1 class="text-2xl font-bold text-center">Login</h1>
      </template>
      <template #content>
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div class="flex flex-col gap-2">
            <label for="email" class="font-semibold">Email</label>
            <InputText
              id="email"
              v-model="email"
              type="email"
              placeholder="Enter your email"
              required
            />
          </div>

          <div class="flex flex-col gap-2">
            <label for="password" class="font-semibold">Password</label>
            <Password
              id="password"
              v-model="password"
              placeholder="Enter your password"
              :feedback="false"
              toggleMask
              required
            />
          </div>

          <Button
            type="submit"
            label="Login"
            class="w-full"
            :loading="authStore.loading"
          />

          <div class="text-center text-sm">
            Don't have an account?
            <router-link
              to="/register"
              class="text-blue-600 hover:underline font-semibold"
            >
              Register
            </router-link>
          </div>
        </form>
      </template>
    </Card>
  </div>
</template>
