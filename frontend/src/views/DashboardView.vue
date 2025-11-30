<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { usersApi } from '@/api/users';
import { useToast } from 'primevue/usetoast';
import type { User } from '@/types/user';
import type { PaginatedResponse } from '@/types/api';
import Card from 'primevue/card';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};

const users = ref<User[]>([]);
const loading = ref(false);
const pagination = ref({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
});

const fetchUsers = async () => {
  loading.value = true;
  try {
    const response: PaginatedResponse<User> = await usersApi.getAll(
      pagination.value.page,
      pagination.value.limit
    );
    users.value = response.data || [];
    if (response.pagination) {
      pagination.value = response.pagination;
    }
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to fetch users',
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchUsers();
});

const onPageChange = (event: any) => {
  pagination.value.page = event.page + 1;
  fetchUsers();
};
</script>

<template>
  <div class="min-h-screen">
    <!-- Navigation -->
    <nav class="bg-white shadow-md">
      <div class="container mx-auto px-4 py-4">
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-bold text-blue-600">My App</h1>
          <div class="flex gap-2 items-center">
            <span class="text-sm text-gray-600">
              Welcome, {{ authStore.user?.username }}
            </span>
            <router-link to="/">
              <Button label="Home" text />
            </router-link>
            <router-link to="/profile">
              <Button label="Profile" severity="secondary" />
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

    <!-- Dashboard Content -->
    <div class="container mx-auto px-4 py-8">
      <h2 class="text-3xl font-bold mb-6">Dashboard</h2>

      <!-- Stats Cards -->
      <div class="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <template #content>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm">Total Users</p>
                <p class="text-3xl font-bold">{{ pagination.total }}</p>
              </div>
              <i class="pi pi-users text-4xl text-blue-500"></i>
            </div>
          </template>
        </Card>

        <Card>
          <template #content>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm">Your Account</p>
                <p class="text-xl font-bold">{{ authStore.user?.email }}</p>
              </div>
              <i class="pi pi-user text-4xl text-green-500"></i>
            </div>
          </template>
        </Card>

        <Card>
          <template #content>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm">Status</p>
                <p class="text-xl font-bold text-green-600">Active</p>
              </div>
              <i class="pi pi-check-circle text-4xl text-green-500"></i>
            </div>
          </template>
        </Card>
      </div>

      <!-- Users Table -->
      <Card>
        <template #title>All Users</template>
        <template #content>
          <DataTable
            :value="users"
            :loading="loading"
            paginator
            :rows="pagination.limit"
            :totalRecords="pagination.total"
            :lazy="true"
            @page="onPageChange"
            stripedRows
          >
            <Column field="username" header="Username" sortable></Column>
            <Column field="email" header="Email" sortable></Column>
            <Column field="created_at" header="Created At" sortable>
              <template #body="slotProps">
                {{ new Date(slotProps.data.created_at).toLocaleDateString() }}
              </template>
            </Column>
          </DataTable>
        </template>
      </Card>
    </div>
  </div>
</template>
