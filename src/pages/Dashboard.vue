<template>
  <div class="admin-dashboard">
    <!-- Header Section -->
    <div class="dashboard-header">
      <div class="header-content">
        <div class="title-section">
          <h1 class="dashboard-title">Task Management Dashboard</h1>
          <p class="dashboard-subtitle">Monitor and manage all tasks across your organization</p>
        </div>
        <div class="header-actions">
          <button @click="openAddTaskDialog(true)" class="btn-primary">
            <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Add New Task
          </button>
          <button @click="logout" class="btn-logout">
            <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            Logout
          </button>
        </div>
      </div>
    </div>

    <!-- Add new task dialog -->
    <VDialog v-model="showAddTaskDialog" max-width="500">
      <VCard>
        <VCardTitle style="margin-top:10px;margin-left:10px;">Add New Task</VCardTitle>
        <VCardText>
          <VTextField v-model="newTask.title" label="Title" required variant="outlined" :disabled="viewIndex" />
          <VTextField v-model="newTask.description" label="Description (optional)" variant="outlined" :disabled="viewIndex" />
          <VSelect
            v-model="newTask.status"
            :items="statusOptions"
            label="Status"
            required
            variant="outlined"
            :disabled="viewIndex"
          />
          <VSelect
            v-model="newTask.priority"
            :items="priorityOptions"
            label="Priority"
            required
            variant="outlined"
            :disabled="viewIndex"
          />
          <!-- <VTextField
            v-model="newTask.order"
            label="Order"
            type="number"
            :readonly="true"
            variant="outlined"
            :disabled="viewIndex"
          /> -->
          <VTextField
            v-model="newTask.dueDate"
            label="Due Date"
            type="date"
            variant="outlined"
            :disabled="viewIndex"
          />
          <VSelect
            v-model="newTask.user_id"
            :items="userOptions"
            label="Assign to User"
            :item-title="'name'"
            :item-value="'id'"
            return-object
            variant="outlined"
            :disabled="viewIndex"
          />
        </VCardText>
        <VCardActions style="margin-bottom:10px;margin-right:15px;">
          <VBtn variant="flat" color="primary" @click="addTask">{{ editIndex ? "Update Task" : "Add Task" }}</VBtn>
          <VBtn variant="flat" color="error" @click="openAddTaskDialog(false)">Cancel</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Statistics Cards -->
    <div class="stats-grid">
      <div class="stat-card total">
        <div class="stat-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ totalTasks }}</div>
          <div class="stat-label">Total Tasks</div>
        </div>
      </div>

      <div class="stat-card pending">
        <div class="stat-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ pendingTasks }}</div>
          <div class="stat-label">Pending Tasks</div>
        </div>
      </div>

      <div class="stat-card completed">
        <div class="stat-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ completedTasks }}</div>
          <div class="stat-label">Completed Tasks</div>
        </div>
      </div>

      <div class="stat-card progress">
        <div class="stat-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ completionRate }}%</div>
          <div class="stat-label">Completion Rate</div>
        </div>
      </div>
    </div>

    <!-- Tasks Table -->
    <div class="table-section">
      <div class="table-header">
        <h2 class="table-title">All Tasks</h2>
        <div class="table-controls">
          <div class="search-box">
            <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Search tasks..."
              class="search-input"
            >
          </div>
          <select v-model="statusFilter" class="status-filter">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="in-progress">In Progress</option>
          </select>
        </div>
      </div>

      <div class="table-container">
        <table class="tasks-table">
          <thead>
            <tr>
              <th>Task ID</th>
              <th>Title</th>
              <th>Assigned User</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Due Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="task in paginatedTasks" :key="task.id" class="table-row">
              <td class="task-id">#{{ task.id }}</td>
              <td class="task-title">{{ task.title }}</td>
              <td class="assigned-user">
                <div class="user-info">
                  <div class="user-avatar">{{ getUserInitials(task.assigned_user?.name) || "Unassigned" }}</div>
                </div>
              </td>
              <td class="task-status">
                <span :class="['status-badge', task.status]">
                  {{ formatStatus(task.status) }}
                </span>
              </td>
              <td class="task-priority">
                <span :class="['priority-badge', task.priority?.toLowerCase()]">
                  {{ task.priority || 'Medium' }}
                </span>
              </td>
              <td class="due-date">{{ formatDate(task.dueDate) }}</td>
              <td class="table-actions">
                <button class="action-btn view" @click="viewTask(task)">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                </button>
                <button class="action-btn edit" @click="editTask(task)">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                </button>
                <button class="action-btn delete" @click="deleteTask(task)">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="pagination-container">
        <div class="pagination-info">
          Showing {{ startIndex + 1 }}-{{ Math.min(endIndex, filteredTasks.length) }} of {{ filteredTasks.length }} tasks
        </div>
        <div class="pagination-controls">
          <button 
            @click="previousPage" 
            :disabled="currentPage === 1"
            class="pagination-btn"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
            Previous
          </button>
          
          <div class="page-numbers">
            <button 
              v-for="page in visiblePages" 
              :key="page"
              @click="goToPage(page)"
              :class="['page-btn', { active: currentPage === page }]"
            >
              {{ page }}
            </button>
          </div>
          
          <button 
            @click="nextPage" 
            :disabled="currentPage === totalPages"
            class="pagination-btn"
          >
            Next
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router';
import { useCrudStore } from '@/stores/useCrudStore';
import { onMounted, computed, ref, watch } from 'vue';
import "@/styles/dashboard.css";
import { VDialog, VCard, VCardTitle, VCardText, VCardActions, VBtn, VTextField, VSelect } from 'vuetify/components';
import { addTasks_url, getAllTasks, getNonAdmins, removeTask_url, updateTasks_url } from '@/utils/constants';
import type { Task } from '@/types/interface.tasks';
import type { Users } from '@/types/interface.users';
import Cookies from 'js-cookie';
import { useAuthStore } from '@/stores/useAuthStore';

const crudStore = useCrudStore();
const authStore = useAuthStore();
const router = useRouter();

// Reactive state
const searchQuery = ref('');
const statusFilter = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(10);
const editIndex = ref(false);
const viewIndex = ref(false);
const showAddTaskDialog = ref(false);

const statusOptions = ['completed', 'pending'];
const priorityOptions = ['low', 'medium', 'high'];
const userOptions = ref([]); // Will be filled by fetchNonAdminUsers()
const editId = ref('');

const newTask = ref<{
  title: string;
  description: string;
  status: string;
  priority: string;
  order: number;
  dueDate: string;
  user_id: Users | null;
}>({
  title: '',
  description: '',
  status: '',
  priority: '',
  order: (crudStore.tasks?.length || 0) + 1,
  dueDate: '',
  user_id: null,
});

const openAddTaskDialog = (open: boolean) => {
  showAddTaskDialog.value = open;
  if (open) {
    fetchNonAdminUsers();
  } else {
    editIndex.value = false;
    viewIndex.value = false;
    newTask.value.title = '';
    newTask.value.description = '',
    newTask.value.status = '',
    newTask.value.priority = '',
    newTask.value.order = (crudStore.tasks?.length || 0) + 1,
    newTask.value.dueDate = '',
    newTask.value.user_id = null;
  }
}

// Logout function
const logout = () => {
  authStore.logout(router);
};

// Placeholder for fetching non-admin users
const fetchNonAdminUsers = async () => {
  await crudStore.fetchItems(getNonAdmins, false, 'users');
  userOptions.value = crudStore.users;
};

const addTask = async () => {
  let payload = {
    title: newTask.value.title,
    description: newTask.value.description,
    status: newTask.value.status,
    priority: newTask.value.priority,
    order: newTask.value.order,
    dueDate: newTask.value.dueDate,
    user_id: newTask.value.user_id?.id,
  };
  if (editIndex.value === true) {
    await crudStore.updateItem(`${updateTasks_url}/${editId.value}`, payload);
  } else {
    await crudStore.createItem(addTasks_url, payload);
  }
  await fetchTasks(false);
  openAddTaskDialog(false);
};

// Computed properties for statistics
const totalTasks = computed(() => crudStore.tasks?.length || 0);
const pendingTasks = computed(() => 
  (crudStore.tasks as Task[]).filter((item: { status: string }) => item.status === "pending").length || 0
);
const completedTasks = computed(() => 
  (crudStore.tasks as Task[]).filter((item: { status: string }) => item.status === "completed").length || 0
);
const completionRate = computed(() => {
  if (totalTasks.value === 0) return 0;
  return Math.round((completedTasks.value / totalTasks.value) * 100);
});

// Filtered tasks based on search and status
const filteredTasks = computed(() => {
  let tasks = crudStore.tasks || [];
  
  // Apply search filter
  if (searchQuery.value) {
    tasks = (crudStore.tasks as Task[]).filter(task => 
      task.title?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      task.assigned_user?.name?.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }
  
  // Apply status filter
  if (statusFilter.value) {
    tasks = (crudStore.tasks as Task[]).filter(task => task.status === statusFilter.value);
  }
  
  return tasks;
});

// Pagination computed properties
const totalPages = computed(() => Math.ceil(filteredTasks.value.length / itemsPerPage.value));
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value);
const endIndex = computed(() => startIndex.value + itemsPerPage.value);

const paginatedTasks = computed(() => 
  filteredTasks.value.slice(startIndex.value, endIndex.value)
);

const visiblePages = computed(() => {
  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages.value, start + maxVisible - 1);
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

// Pagination methods
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const goToPage = (page: number) => {
  currentPage.value = page;
};

// Utility methods
const getUserInitials = (name: string) => {
  return name;
};

const formatStatus = (status: string) => {
  return status?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Pending';
};

const formatDate = (date: string | Date) => {
  if (!date) return 'No due date';
  return new Date(date).toLocaleDateString();
};

const viewTask = (task: any) => {
  viewIndex.value = true;
  editId.value = task.id;
  // Assign all fields from the selected task to the modal's newTask
  newTask.value.title = task.title || '';
  newTask.value.description = task.description || '';
  newTask.value.status = task.status || '';
  newTask.value.priority = task.priority || '';
  newTask.value.order = task.order || ((crudStore.tasks?.length || 0) + 1);
  newTask.value.dueDate = task.dueDate || '';
  // For user_id, find the user object in userOptions that matches the assigned_user's id
  newTask.value.user_id = userOptions.value.find((u: any) => u.id === task.assigned_user?.id) || null;

  openAddTaskDialog(true);
};

const editTask = (task: any) => {
  editIndex.value = true;
  editId.value = task.id;
  // Assign all fields from the selected task to the modal's newTask
  newTask.value.title = task.title || '';
  newTask.value.description = task.description || '';
  newTask.value.status = task.status || '';
  newTask.value.priority = task.priority || '';
  newTask.value.order = task.order || ((crudStore.tasks?.length || 0) + 1);
  newTask.value.dueDate = task.dueDate || '';
  // For user_id, find the user object in userOptions that matches the assigned_user's id
  newTask.value.user_id = userOptions.value.find((u: any) => u.id === task.assigned_user?.id) || null;

  openAddTaskDialog(true);
};

const deleteTask = async (task: any) => {
  editId.value = task.id;
  const removeTask = await crudStore.deleteItem(`${removeTask_url}/${editId.value}`);

  if (removeTask) {
    editId.value = "";
  }
  await fetchTasks(false);
}

const fetchTasks = async (loading: boolean) => {
  await crudStore.fetchItems(getAllTasks, loading, "tasks");
}

onMounted(() => {
  fetchTasks(true);
});

// Reset pagination when filters change
watch([searchQuery, statusFilter], () => {
  currentPage.value = 1;
});
</script>