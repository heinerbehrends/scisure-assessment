<script setup lang="ts">
import { ref, computed } from "vue";
import { useQuery } from "@vue/apollo-composable";
import { type UsersResponse, GET_USERS } from "./create-types-queries";
import { useCreatePost } from "./useCreatePost";

const title = ref("");
const body = ref("");
const username = ref("");

function createPost() {
  if (!title.value.trim() || !body.value.trim() || !username.value) {
    return;
  }

  createPostMutation()
    .then((response) => {
      if (response?.data?.createPost) {
        // add success notification here
        console.log("Post created successfully:", response.data.createPost);
      }
    })
    .catch((error) => {
      // add error notification here
      console.error("Error creating post:", error);
    });
}

const { result, loading, error } = useQuery<UsersResponse>(GET_USERS);

const userId = computed(
  () =>
    result.value?.users?.data?.find((user) => user.username === username.value)
      ?.id
);

const { createPostMutation, createLoading, createError } = useCreatePost({
  title,
  body,
  username,
  userId,
});
</script>
<template>
  <section class="create-post">
    <h2>Create Post</h2>

    <!-- Error message display -->
    <div v-if="createError" class="error-message">
      Error creating post: {{ createError.message }}
    </div>

    <form @submit.prevent="createPost">
      <div class="create-post-container">
        <template v-if="result && result.users">
          <label for="username">Select User</label>
          <div v-if="error" class="error-message">
            Error loading users: {{ error.message }}
          </div>
          <p class="user-input" v-if="loading">Loading...</p>
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
          class="body-input"
        />
        <button type="submit" :disabled="createLoading" class="submit-button">
          {{ createLoading ? "Creating..." : "Create Post" }}
        </button>
      </div>
    </form>
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
