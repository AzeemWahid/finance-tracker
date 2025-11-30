<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { usersApi } from '@/api/users';
import { useToast } from 'primevue/usetoast';
import Card from 'primevue/card';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';

const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};

const email = ref('');
const username = ref('');
const password = ref('');
const loading = ref(false);

onMounted(() => {
  if (authStore.user) {
    email.value = authStore.user.email;
    username.value = authStore.user.username;
  }
});

const handleUpdate = async () => {
  if (!authStore.user) return;

  loading.value = true;
  try {
    const updateData: any = {};
    if (email.value !== authStore.user.email) {
      updateData.email = email.value;
    }
    if (username.value !== authStore.user.username) {
      updateData.username = username.value;
    }
    if (password.value) {
      updateData.password = password.value;
    }

    if (Object.keys(updateData).length === 0) {
      toast.add({
        severity: 'info',
        summary: 'No Changes',
        detail: 'No changes to update',
        life: 3000,
      });
      return;
    }

    await usersApi.update(authStore.user.id, updateData);

    // Refresh user data
    await authStore.fetchCurrentUser();

    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Profile updated successfully',
      life: 3000,
    });

    password.value = '';
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.response?.data?.message || 'Failed to update profile',
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
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
            <router-link to="/">
              <Button label="Home" text />
            </router-link>
            <router-link to="/dashboard">
              <Button label="Dashboard" severity="secondary" />
            </router-link>
            <Button
              label="Logout"
              severity="danger"
              @click="handleLogout"
            />
          </div>
        </div>
      </div>
    </nav>

    <!-- Profile Content -->
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-2xl mx-auto">
        <h2 class="text-3xl font-bold mb-6">Profile Settings</h2>

        <Card>
          <template #title>Update Your Information</template>
          <template #content>
            <form @submit.prevent="handleUpdate" class="space-y-4">
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
                <label for="password" class="font-semibold">
                  New Password (optional)
                </label>
                <Password
                  id="password"
                  v-model="password"
                  placeholder="Enter new password to change"
                  toggleMask
                >
                  <template #footer>
                    <p class="text-xs mt-2">
                      Leave blank to keep current password
                    </p>
                  </template>
                </Password>
              </div>

              <div class="flex gap-2">
                <Button
                  type="submit"
                  label="Update Profile"
                  :loading="loading"
                />
                <router-link to="/dashboard">
                  <Button label="Cancel" severity="secondary" />
                </router-link>
              </div>
            </form>
          </template>
        </Card>

        <!-- Account Info Card -->
        <Card class="mt-6">
          <template #title>Account Information</template>
          <template #content>
            <div class="space-y-2">
              <div class="flex justify-between py-2 border-b">
                <span class="font-semibold">User ID:</span>
                <span class="text-gray-600">{{ authStore.user?.id }}</span>
              </div>
              <div class="flex justify-between py-2 border-b">
                <span class="font-semibold">Created At:</span>
                <span class="text-gray-600">
                  {{
                    authStore.user?.created_at
                      ? new Date(authStore.user.created_at).toLocaleString()
                      : 'N/A'
                  }}
                </span>
              </div>
              <div class="flex justify-between py-2">
                <span class="font-semibold">Last Updated:</span>
                <span class="text-gray-600">
                  {{
                    authStore.user?.updated_at
                      ? new Date(authStore.user.updated_at).toLocaleString()
                      : 'N/A'
                  }}
                </span>
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>
