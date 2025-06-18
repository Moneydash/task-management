<template>
  <div class="task-container">
    <div class="task-board">
      <!-- Header -->
      <div class="header-section">
        <h1 class="title">My Tasks</h1>
        <p class="subtitle">Manage and organize your work</p>
        <div class="header-actions">
          <button @click="handleLogout" class="btn btn-logout logout-btn">
            <ArrowRightOnRectangleIcon class="w-5 h-5 text-gray-600" />
            <span>Logout</span>
          </button>
          <button @click="showCreateForm = !showCreateForm" class="btn btn-primary add-task-btn">
            <PlusIcon class="w-5 h-5" />
            <span>New</span>
          </button>
        </div>
      </div>

      <!-- Create Task Form -->
      <div v-if="showCreateForm" class="create-form-container">
        <div class="create-form">
          <h3 class="form-title">Create New Task</h3>
          
          <form @submit.prevent="handleCreateTask" class="task-form">
            <div class="form-group">
              <label for="title" class="form-label">
                Task Title <span class="required">*</span>
              </label>
              <input
                id="title"
                v-model="newTask.title"
                type="text"
                class="form-input"
                placeholder="Enter task title..."
                required
              />
            </div>

            <div class="form-group">
              <label for="description" class="form-label">Description</label>
              <textarea
                id="description"
                v-model="newTask.description"
                class="form-textarea"
                placeholder="Describe your task..."
                rows="3"
              ></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="status" class="form-label">
                  Status <span class="required">*</span>
                </label>
                <select
                  id="status"
                  v-model="newTask.status"
                  class="form-select"
                  required
                >
                  <option value="">Select status</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div class="form-group">
                <label for="priority" class="form-label">
                  Priority <span class="required">*</span>
                </label>
                <select
                  id="priority"
                  v-model="newTask.priority"
                  class="form-select"
                  required
                >
                  <option value="">Select priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div class="form-actions">
              <button type="button" @click="cancelCreate" class="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" class="btn btn-primary" :disabled="!isCreateFormValid">
                {{ editIndex === true ? 'Update Task' : 'Create Task' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Filter Controls -->
      <div class="filter-section">
        <div class="filter-group">
          <label for="statusFilter" class="filter-label">Filter by Status:</label>
          <select
            id="statusFilter"
            v-model="filters.status"
            class="filter-select"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div class="filter-group">
          <label for="priorityFilter" class="filter-label">Filter by Priority:</label>
          <select
            id="priorityFilter"
            v-model="filters.priority"
            class="filter-select"
          >
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <button @click="clearFilters" class="btn btn-secondary clear-filters-btn">
          Clear Filters
        </button>
      </div>

      <!-- Tasks List -->
      <div class="tasks-section">
        <div v-if="crudStore.loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Loading tasks...</p>
        </div>

        <div v-else-if="filteredTasks.length === 0 && crudStore.tasks.length === 0" class="empty-state">
          <div class="empty-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
              <path d="M9 11H15M9 15H15M17 3H7C5.89543 3 5 3.89543 5 5V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V5C19 3.89543 18.1046 3 17 3Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <h3>No tasks yet</h3>
          <p>Create your first task to get started</p>
        </div>

        <div v-else-if="filteredTasks.length === 0" class="empty-state">
          <div class="empty-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
              <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <h3>No tasks match your filters</h3>
          <p>Try adjusting your filter criteria</p>
        </div>

        <div v-else class="tasks-list">
          <div class="list-header">
            <h3>Your Tasks ({{ filteredTasks?.length }}{{ filteredTasks.length !== crudStore.tasks.length ? ` of ${crudStore.tasks.length}` : '' }})</h3>
            <p class="drag-hint">Drag to reorder</p>
          </div>

          <div
            class="task-item"
            v-for="(task, index) in filteredTasks"
            :key="task.id"
            :draggable="true"
            @dragstart="handleDragStart(getOriginalIndex(task), $event)"
            @dragover.prevent="handleDragOver(getOriginalIndex(task))"
            @drop="handleDrop(getOriginalIndex(task))"
            @dragend="handleDragEnd"
            :class="{ 'drag-over': dragOverIndex === getOriginalIndex(task), 'dragging': draggingIndex === getOriginalIndex(task) }"
          >
            <div class="task-content">
              <div class="task-header">
                <h4 class="task-title">{{ task.title }}</h4>
                <div class="task-meta">
                  <span class="priority-badge" :class="`priority-${task.priority}`">
                    {{ formatPriority(task.priority) }}
                  </span>
                  <span class="status-badge" :class="`status-${task.status}`">
                    {{ formatStatus(task.status) }}
                  </span>
                </div>
              </div>
              
              <p v-if="task.description" class="task-description">
                {{ task.description }}
              </p>
              
              <div class="task-footer">
                <span class="task-order">Order: {{ task.order }}</span>
                <div class="task-actions">
                  <button v-if="task.status === 'pending'" class="action-btn edit-btn" @click="editTask(task)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M11 4H4C2.89543 4 2 4.89543 2 6V20C2 21.1046 2.89543 22 4 22H18C19.1046 22 20 21.1046 20 20V13M18.5 2.5C19.3284 1.67157 20.6716 1.67157 21.5 2.5C22.3284 3.32843 22.3284 4.67157 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            <div class="drag-handle">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M8 6H8.01M8 12H8.01M8 18H8.01M16 6H16.01M16 12H16.01M16 18H16.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Success Message -->
      <div v-if="showSuccess" class="success-message">
        <div class="success-icon">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M16.25 6.25L8.125 14.375L3.75 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <span>{{ successMessage }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import "@/styles/todo.css";
import type { Task } from '@/types/interface.tasks';
import type { Users } from '@/types/interface.users';
import { useCrudStore } from '@/stores/useCrudStore';
import { addTasks_url, getTaskByUserId, reorderTask, updateTasks_url } from '@/utils/constants';
import Cookies from 'js-cookie';
import { formRequest } from '@/api/request';
import { ArrowRightOnRectangleIcon, PlusIcon } from '@heroicons/vue/24/outline';
import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter } from 'vue-router';

interface NewTask {
  title: string
  description: string
  status: string
  priority: string
}

const crudStore = useCrudStore();
const authStore = useAuthStore();
const router = useRouter();

// Reactive data
const showCreateForm = ref(false)
const showSuccess = ref(false)
const successMessage = ref('')
const currentUserId = Cookies.get("user_id");
const editId = ref(0);

const editIndex = ref(false);

// Filter state
const filters = ref({
  status: '',
  priority: ''
})

// Drag and drop state
const draggingIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)

// New task form
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
  order: 1,
  dueDate: '',
  user_id: null,
});

// Computed properties
const isCreateFormValid = computed(() => {
  return newTask.value.title.trim() !== '' && 
         newTask.value.status !== '' && 
         newTask.value.priority !== ''
})

// Filtered tasks computed property
const filteredTasks = computed(() => {
  if (!crudStore.tasks) return []
  
  return crudStore.tasks.filter((task: Task) => {
    const statusMatch = !filters.value.status || task.status === filters.value.status
    const priorityMatch = !filters.value.priority || task.priority === filters.value.priority
    
    return statusMatch && priorityMatch
  })
})

// Utility functions
const formatPriority = (priority: string): string => {
  return priority.charAt(0).toUpperCase() + priority.slice(1)
}

const formatStatus = (status: string): string => {
  return status.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}

const getUserIdFromCookies = (): number => {
  const UserId = Cookies.get("user_id") || "";
  return parseInt(UserId);
}

const showSuccessMessage = (message: string) => {
  successMessage.value = message
  showSuccess.value = true
  setTimeout(() => {
    showSuccess.value = false
  }, 3000)
}

// Filter functions
const clearFilters = (): void => {
  filters.value.status = ''
  filters.value.priority = ''
}

const getOriginalIndex = (task: Task): number => {
  return crudStore.tasks.findIndex((t: Task) => t.id === task.id)
}

// Logout function (empty for you to implement)
const handleLogout = async () => {
  authStore.logout(router);
}

// Task management functions (empty - to be implemented by you)
const fetchTasks = async (loading: boolean) => {
  await crudStore.fetchItems(`${getTaskByUserId}/${currentUserId}`, loading, 'tasks');
}

const handleCreateTask = async (): Promise<void> => {
  if (!isCreateFormValid.value) return
  const date = new Date();
  date.setDate(date.getDate() + 3);
  const dueDate = date.toISOString().slice(0, 10); // "YYYY-MM-DD"
  try {
    // TODO: Implement API call to create task
    const payload = {
      title: newTask.value.title,
      description: newTask.value.description,
      status: newTask.value.status,
      priority: newTask.value.priority,
      order: editIndex.value === true ? newTask.value.order : 1,
      dueDate: dueDate,
      user_id: getUserIdFromCookies(),
    }
    
    if (editIndex.value === true) {
      await crudStore.updateItem(`${updateTasks_url}/${editId.value}`, payload)
    } else {
      await crudStore.createItem(addTasks_url, payload);
    }
    await fetchTasks(false);
    resetCreateForm();
  } catch (error) {
    console.error('Error creating task:', error)
  }
}

const updateTaskOrder = async (taskId: string, newOrder: number): Promise<void> => {
  try {
    const payload = crudStore.tasks.map((task: Task) => ({
      id: task.id,
      order: task.order
    }));
    await formRequest("POST", reorderTask, payload);
  } catch (error) {
    console.error('Error updating task order:', error)
  }
}

const editTask = (task: Task): void => {
  editId.value = task.id;
  newTask.value.title = task.title;
  newTask.value.description = task.description;
  newTask.value.status = task.status;
  newTask.value.priority = task.priority;

  showCreateForm.value = true;
  editIndex.value = true;
}

// Form functions
const resetCreateForm = (): void => {
  newTask.value.title = ''
  newTask.value.description = ''
  newTask.value.status = ''
  newTask.value.priority = ''
  showCreateForm.value = false
  editIndex.value = false;
  editId.value = 0;
}

const cancelCreate = (): void => {
  resetCreateForm()
}

// Drag and drop functions
const handleDragStart = (index: number, event: DragEvent): void => {
  draggingIndex.value = index
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/html', index.toString())
  }
}

const handleDragOver = (index: number): void => {
  dragOverIndex.value = index
}

const handleDrop = async (dropIndex: number): Promise<void> => {
  if (draggingIndex.value === null || draggingIndex.value === dropIndex) {
    return;
  }

  // Always work with a sorted copy
  const newTasks = [...crudStore.tasks].sort((a, b) => a.order - b.order);

  // Remove the dragged task from its original position
  const [draggedTask] = newTasks.splice(draggingIndex.value, 1);

  // Insert the dragged task at the new position
  newTasks.splice(dropIndex, 0, draggedTask);

  // Renumber the order property sequentially starting from 1
  newTasks.forEach((task, index) => {
    task.order = index + 1;
  });

  // Update the store
  crudStore.tasks = newTasks;

  // Optionally, update the order in the database for all tasks
  try {
    // Save the new order for all tasks (recommended)
    for (const task of newTasks) {
      await updateTaskOrder(task.id, task.order);
    }
    showSuccessMessage('Task order updated!');
  } catch (error) {
    // Revert on error
    await fetchTasks(false);
  }

  handleDragEnd();
};

const handleDragEnd = (): void => {
  draggingIndex.value = null
  dragOverIndex.value = null
}

// Lifecycle
onMounted(() => {
  fetchTasks(true);
})
</script>