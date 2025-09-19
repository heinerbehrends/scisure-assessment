<template>
  <Transition name="notification">
    <div
      v-if="notification"
      class="error-notification"
      role="alert"
      aria-live="polite"
      aria-labelledby="message"
    >
      <div class="content">
        <div class="title">{{ notification.title }}</div>
        <div v-if="notification.message" id="message" class="message">
          {{ notification.message }}
        </div>
      </div>
      <button
        class="close"
        @click="$emit('close')"
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
type ErrorNotification = {
  id: string;
  title: string;
  message?: string;
};

defineProps<{
  notification: ErrorNotification | null;
}>();

defineEmits<{
  close: [];
}>();
</script>

<style scoped>
.error-notification {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem 0.75rem 0.75rem 1.5rem;
  border-radius: 0.25rem;
  background-color: #fef2f2;
  border-left: 4px solid #ef4444;
  color: #991b1b;
}

.content {
  flex: 1;
  min-width: 0;
}

.title {
  font-weight: 600;
  line-height: 1.25rem;
  margin-bottom: 0.25rem;
}

.message {
  font-size: 0.875rem;
  line-height: 1rem;
  opacity: 0.8;
}

.close {
  background: none;
  border: none;
  font-size: 1.25rem;
  font-weight: bold;
  cursor: pointer;
  padding: 0.75rem;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1px solid #666;
  opacity: 0.7;
  transition: opacity 0.2s ease-in-out;
  flex-shrink: 0;
}

.close:hover {
  opacity: 1;
  background-color: rgba(0, 0, 0, 0.1);
}

/* Transition animations */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease-in-out;
}

.notification-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.notification-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (prefers-color-scheme: dark) {
  .error-notification {
    background-color: #7f1d1d;
    color: #fecaca;
  }

  .close:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
}
</style>
