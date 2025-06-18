<template>
  <div class="unauthorized-container">
    <!-- Background Elements -->
    <div class="background-gradient"></div>
    <div class="floating-shapes">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
    </div>

    <!-- Main Content -->
    <div class="content-wrapper">
      <div class="error-card">
        <!-- Lock Icon -->
        <div class="icon-container">
          <svg class="lock-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 10V8C6 5.79086 7.79086 4 10 4H14C16.2091 4 18 5.79086 18 8V10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <rect x="4" y="10" width="16" height="10" rx="2" stroke="currentColor" stroke-width="2"/>
            <circle cx="12" cy="15" r="1" fill="currentColor"/>
          </svg>
        </div>

        <!-- Error Code -->
        <div class="error-code">401</div>

        <!-- Title -->
        <h1 class="error-title">Access Denied</h1>

        <!-- Description -->
        <p class="error-description">
          You don't have permission to access this resource. Please check your credentials or contact your administrator.
        </p>

        <!-- Action Buttons -->
        <div class="button-group">
          <button class="btn btn-primary" @click="goBack">
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Go Back
          </button>
          <button class="btn btn-secondary" @click="goHome">
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 9L12 2L21 9V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M9 22V12H15V22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Home
          </button>
        </div>

        <!-- Help Link -->
        <div class="help-section">
          <a href="#" class="help-link" @click="showHelp">
            Need help? Contact support
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import "@/styles/unauthorized.css";
const goBack = () => {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    window.location.href = '/';
  }
};

const goHome = () => {
  window.location.href = '/';
};

const showHelp = (event: Event) => {
  event.preventDefault();
  // You can implement help functionality here
  alert('Contact support at: support@yourcompany.com');
};
</script>