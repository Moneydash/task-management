<template>
  <div class="landing-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-background">
        <div class="floating-shapes">
          <div class="shape shape-1"></div>
          <div class="shape shape-2"></div>
          <div class="shape shape-3"></div>
        </div>
      </div>
      <div class="hero-content">
        <div class="hero-badge">
          <span class="badge-text">✨ Next-Gen Task Management</span>
        </div>
        <h1 class="hero-title">
          Master Your 
          <span class="gradient-text">Workflow</span>
        </h1>
        <p class="hero-subtitle">
          Transform chaos into clarity with intelligent task management that adapts to your team's unique rhythm
        </p>
        <div class="hero-buttons">
          <RouterLink to="/register" class="cta-button primary flex items-center gap-2">
            <span>Sign Up</span>
            <UserPlusIcon class="w-5 h-5" />
          </RouterLink>
          <RouterLink to="/login" class="cta-button secondary flex items-center gap-2">
            <i class="fas fa-play"></i>
            <span>Sign In</span>
            <ArrowLeftEndOnRectangleIcon class="w-5 h-5" />
          </RouterLink>
        </div>
        <div class="hero-stats">
          <div class="stat">
            <span class="stat-number">50K+</span>
            <span class="stat-label">Active Teams</span>
          </div>
          <div class="stat">
            <span class="stat-number">2M+</span>
            <span class="stat-label">Tasks Completed</span>
          </div>
          <div class="stat">
            <span class="stat-number">99.9%</span>
            <span class="stat-label">Uptime</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features">
      <div class="container">
        <div class="features-header">
          <h2>Powerful Features for Modern Teams</h2>
          <p>Everything you need to streamline your workflow and boost productivity</p>
        </div>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-project-diagram"></i>
            </div>
            <h3>Advanced Project Management</h3>
            <p>Organize complex projects with Kanban boards, Gantt charts, and timeline views</p>
            <div class="feature-tags">
              <span class="tag">Kanban</span>
              <span class="tag">Gantt</span>
              <span class="tag">Timeline</span>
            </div>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-users"></i>
            </div>
            <h3>Team Collaboration</h3>
            <p>Real-time collaboration with comments, mentions, and seamless file sharing</p>
            <div class="feature-tags">
              <span class="tag">Real-time</span>
              <span class="tag">Comments</span>
              <span class="tag">File Sharing</span>
            </div>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-brain"></i>
            </div>
            <h3>AI-Powered Insights</h3>
            <p>Smart suggestions, automated workflows, and predictive analytics for better decisions</p>
            <div class="feature-tags">
              <span class="tag">AI Insights</span>
              <span class="tag">Automation</span>
              <span class="tag">Analytics</span>
            </div>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-mobile-alt"></i>
            </div>
            <h3>Cross-Platform Sync</h3>
            <p>Native apps for all devices with offline support and real-time synchronization</p>
            <div class="feature-tags">
              <span class="tag">Mobile</span>
              <span class="tag">Offline</span>
              <span class="tag">Sync</span>
            </div>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-chart-line"></i>
            </div>
            <h3>Advanced Analytics</h3>
            <p>Comprehensive reports and insights to track productivity and team performance</p>
            <div class="feature-tags">
              <span class="tag">Reports</span>
              <span class="tag">Metrics</span>
              <span class="tag">Performance</span>
            </div>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-shield-alt"></i>
            </div>
            <h3>Enterprise Security</h3>
            <p>Bank-level security with SSO, 2FA, and compliance with industry standards</p>
            <div class="feature-tags">
              <span class="tag">SSO</span>
              <span class="tag">2FA</span>
              <span class="tag">SOC 2</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="cta-background">
        <div class="cta-particles">
          <div class="particle"></div>
          <div class="particle"></div>
          <div class="particle"></div>
        </div>
      </div>
      <div class="container">
        <div class="cta-content">
          <h2>Ready to Transform Your Workflow?</h2>
          <p>Join thousands of successful teams who've already made the switch</p>
          <div class="cta-note">
            <p>✓ No credit card required</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import "@/styles/landing.css";
import { ArrowLeftEndOnRectangleIcon, UserPlusIcon } from "@heroicons/vue/24/outline";
</script>