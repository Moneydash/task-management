<template>
  <div class="registration-container">
    <!-- Animated background elements -->
    <div class="background-overlay">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="blob blob-3"></div>
    </div>

    <!-- Main registration card -->
    <div class="registration-card">
      <!-- Header section -->
      <div class="header-section">
        <div class="icon-container">
          <div class="icon-glow"></div>
          <div class="icon-wrapper">
            <UserPlusIcon class="user-icon" />
          </div>
        </div>
        <p class="subtitle">Create your account to get started</p>
      </div>

      <!-- Registration form -->
      <form @submit.prevent="onRegister" class="registration-form">
        <!-- Name field -->
        <div class="form-group">
          <label class="form-label" for="name">
            Full Name
          </label>
          <div class="input-wrapper">
            <input 
              v-model="name" 
              id="name" 
              type="text" 
              required 
              class="form-input" 
              placeholder="Enter your full name"
              @focus="handleFocus"
              @blur="handleBlur"
            />
          </div>
        </div>

        <!-- Email field -->
        <div class="form-group">
          <label class="form-label" for="email">
            Email Address
          </label>
          <div class="input-wrapper">
            <input 
              v-model="email" 
              id="email" 
              type="email" 
              required 
              class="form-input" 
              placeholder="you@example.com"
              @focus="handleFocus"
              @blur="handleBlur"
            />
          </div>
        </div>

        <!-- Password field -->
        <div class="form-group">
          <label class="form-label" for="password">
            Password
          </label>
          <div class="input-wrapper">
            <input 
              v-model="password" 
              id="password" 
              type="password" 
              required 
              class="form-input" 
              placeholder="Create a strong password"
              @focus="handleFocus"
              @blur="handleBlur"
            />
          </div>
        </div>

        <!-- Confirm Password field -->
        <div class="form-group">
          <label class="form-label" for="passwordConfirm">
            Confirm Password
          </label>
          <div class="input-wrapper">
            <input 
              v-model="passwordConfirm" 
              id="passwordConfirm" 
              type="password" 
              required 
              class="form-input" 
              placeholder="Confirm your password"
              @focus="handleFocus"
              @blur="handleBlur"
            />
          </div>
        </div>

        <!-- Submit button -->
        <button 
          type="submit" 
          class="submit-button"
          :disabled="authStore.loading || !name || !email || !password || !passwordConfirm"
        >
          <span v-if="authStore.loading" class="button-content">
            Creating your account...
          </span>
          <span v-else class="button-content">
            Create Account
          </span>
        </button>
      </form>

      <!-- Login link -->
      <div class="login-link-section">
        <span class="login-text">Already have an account?</span>
        <RouterLink 
          to="/login" 
          class="login-link"
        >
          Sign In
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { UserPlusIcon } from '@heroicons/vue/24/outline'
import "../styles/register.css";
import { useAuthStore } from '../stores/useAuthStore';
import * as EmailValidator from 'email-validator';
import { toast } from 'vue-sonner';
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();
const name = ref('')
const email = ref('')
const password = ref('')
const passwordConfirm = ref('')

const onRegister = async () => {
  let payload = {
    name: name.value,
    email: email.value,
    password: password.value
  };

  if (!EmailValidator.validate(email.value)) {
    toast.error("Invalid Email");
    return;
  }

  if (password.value !== passwordConfirm.value) {
    toast.error("Password not match!");
    return;
  }

  if (password.value?.length < 8) {
    toast.error("Password is too short!");
    return;
  }

  const success = await authStore.register(payload);
  
  if (success) {
    name.value = '';
    email.value = '';
    password.value = '';
    passwordConfirm.value = '';
    router.push('/login');
  }
}

function handleFocus(event: Event) {
  const target = event.target as HTMLInputElement
  target.parentElement?.classList.add('focused')
}

function handleBlur(event: Event) {
  const target = event.target as HTMLInputElement
  target.parentElement?.classList.remove('focused')
}
</script>