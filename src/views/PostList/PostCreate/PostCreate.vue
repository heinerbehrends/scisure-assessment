<script setup lang="ts">
import { ref, computed } from "vue";
import { useQuery } from "@vue/apollo-composable";
import { type UsersResponse, GET_USERS } from "./create-types-queries";
import { useCreatePost } from "./useCreatePost";
import ErrorNotification from "./ErrorNotification.vue";

const title = ref("");
const body = ref("");
const username = ref("");

const currentNotification = ref<{
  id: string;
  title: string;
  message?: string;
} | null>(null);

function showNotification(title: string, message: string) {
  currentNotification.value = {
    id: `notification-${Date.now()}`,
    title,
    message,
  };
}

function clearNotification() {
  currentNotification.value = null;
}

function createPost() {
  if (!title.value.trim() || !body.value.trim() || !username.value) {
    return;
  }

  createPostMutation()
    .then((response) => {
      if (response?.data?.createPost) {
        title.value = "";
        body.value = "";
      }
    })
    .catch((error) => {
      showNotification(
        "Failed to Create Post",
        error.message || "An unexpected error occurred. Please try again."
      );
    });
}

const { result, loading, error } = useQuery<UsersResponse>(GET_USERS);

const userId = computed(
  () =>
    result.value?.users?.data?.find((user) => user.username === username.value)
      ?.id
);

const { createPostMutation, createLoading } = useCreatePost({
  title,
  body,
  username,
  userId,
});
</script>

<template>
  <section class="create-post">
    <h2>Create Post</h2>
    <form @submit.prevent="createPost">
      <div class="create-post-container">
        <template v-if="result && result.users">
          <label for="username">Select User</label>
          <div
            v-if="error"
            class="error-message"
            role="alert"
            aria-live="assertive"
          >
            Error loading users: {{ error.message }}
          </div>
          <p class="user-input" v-if="loading" role="alert" aria-live="polite">
            Loading...
          </p>
          <select
            id="username"
            v-model="username"
            :disabled="createLoading"
            required
            :class="{ placeholder: !username }"
          >
            <option value="" disabled selected class="placeholder">
              Select a username
            </option>
            <option
              v-for="user in result.users.data"
              :key="user.id"
              :value="user.username"
            >
              {{ user.username }}
            </option>
          </select>
        </template>
        <label for="title" class="title-label">Title</label>
        <input
          id="title"
          type="text"
          v-model="title"
          placeholder="Title"
          :disabled="createLoading"
          required
          aria-required="true"
          class="title-input"
        />
        <label for="body" class="body-label">Body</label>
        <textarea
          id="body"
          rows="10"
          v-model="body"
          placeholder="Body"
          :disabled="createLoading"
          required
          aria-required="true"
          class="body-input"
        />
        <button
          type="submit"
          :disabled="createLoading"
          class="submit-button"
          aria-live="polite"
        >
          {{ createLoading ? "Creating..." : "Create Post" }}
        </button>
      </div>
    </form>

    <!-- Notification displayed underneath the create post button -->
    <ErrorNotification
      :notification="currentNotification"
      @close="clearNotification"
    />
  </section>
</template>

<style scoped>
.create-post {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.create-post-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.user-input {
  padding: 0.75rem 1.5rem;
}
.placeholder {
  color: #666;
}
.placeholder option {
  color: #fff;
  @media (prefers-color-scheme: light) {
    color: #000;
  }
  padding: 0.75rem 1.5rem;
}
</style>
