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
const username = ref('');
const password = ref('');

const handleRegister = async () => {
  try {
    await authStore.register({
      email: email.value,
      username: username.value,
      password: password.value,
    });
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Registration successful!',
      life: 3000,
    });
    router.push('/dashboard');
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.response?.data?.message || 'Registration failed',
      life: 3000,
    });
  }
};
</script>

<template>
  <div class="flex items-center justify-center min-h-screen px-4">
    <Card class="w-full max-w-md">
      <template #title>
        <h1 class="text-2xl font-bold text-center">Register</h1>
      </template>
      <template #content>
        <form @submit.prevent="handleRegister" class="space-y-4">
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
            <label for="username" class="font-semibold">Username</label>
            <InputText
              id="username"
              v-model="username"
              placeholder="Enter your username"
              required
            />
          </div>

          <div class="flex flex-col gap-2">
            <label for="password" class="font-semibold">Password</label>
            <Password
              id="password"
              v-model="password"
              placeholder="Enter your password"
              toggleMask
              required
            >
              <template #footer>
                <p class="text-xs mt-2">
                  Password must be at least 8 characters with uppercase,
                  lowercase, and number
                </p>
              </template>
            </Password>
          </div>

          <Button
            type="submit"
            label="Register"
            class="w-full"
            :loading="authStore.loading"
          />

          <div class="text-center text-sm">
            Already have an account?
            <router-link
              to="/login"
              class="text-blue-600 hover:underline font-semibold"
            >
              Login
            </router-link>
          </div>
        </form>
      </template>
    </Card>
  </div>
</template>
