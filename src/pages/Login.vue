<template>
  <div class="login-container">
    <!-- Animated background elements -->
    <div class="background-overlay">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="blob blob-3"></div>
    </div>

    <!-- Main login card -->
    <div class="login-card">
      <!-- Header section -->
      <div class="header-section">
        <div class="icon-container">
          <div class="icon-glow"></div>
          <div class="icon-wrapper">
            <LockClosedIcon class="lock-icon" />
          </div>
        </div>
        <h2 class="title">
          Welcome Back
        </h2>
        <p class="subtitle">Sign in to your account</p>
      </div>

      <!-- Login form -->
      <form @submit.prevent="onLogin" class="login-form">
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
              class="form-input password-input" 
              placeholder="Enter your password"
              @focus="handleFocus"
              @blur="handleBlur"
            />
          </div>
        </div>

        <!-- Submit button -->
        <button 
          type="submit" 
          class="submit-button"
        >
          <span class="button-content">
            Sign In
          </span>
        </button>
      </form>

      <!-- Register link -->
      <div class="register-link-section">
        <span class="register-text">Don't have an account?</span>
        <RouterLink 
          to="/register" 
          class="register-link"
        >
          Sign Up
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'
import "@/styles/login.css";
import * as EmailValidator from 'email-validator';
import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter } from 'vue-router';
import Cookies from 'js-cookie';

const authStore = useAuthStore(); 
const email = ref('')
const password = ref('')
const role = Cookies.get("user_role");

const router = useRouter();
const onLogin = async () => {
  let payload = {
    email: email.value,
    password: password.value
  }

  if (!EmailValidator.validate(email.value)) {
    alert("Not a valid email address!");
    return;
  }

  const success = await authStore.login(payload, router);
  if (success) {
    email.value = '';
    password.value = '';
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