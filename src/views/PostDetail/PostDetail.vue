<script setup lang="ts">
import { useQuery } from "@vue/apollo-composable";
import { computed } from "vue";
import { useRoute } from "vue-router";
import {
  type PostQueryResponse,
  type PostQueryArgs,
  GET_POST,
} from "./detail-types-queries";
import Comments from "./Comments.vue";

const route = useRoute();
const postId = computed(() => route.params.id as string);
const currentPage = computed(() => route.query.page as string);
const searchQuery = computed(() => route.query.search as string);

const { result, loading, error } = useQuery<PostQueryResponse, PostQueryArgs>(
  GET_POST,
  () => ({
    postId: postId.value,
  })
);
</script>

<template>
  <div class="post-detail">
    <!-- back to posts -->
    <router-link
      :to="{ name: 'Home', query: { page: currentPage, search: searchQuery } }"
      class="back-link"
    >
      ← Back to Posts
    </router-link>
    <!-- Loading -->
    <div v-if="loading" class="loading">Loading post...</div>
    <!-- Error -->
    <div v-if="error" class="error">{{ error }}</div>
    <!-- Post -->
    <div v-if="result && result.post" class="post">
      <h1>{{ result.post.title }}</h1>
      <p class="meta">By {{ result.post.user?.username }}</p>
      <div class="body">{{ result.post.body }}</div>
      <!-- Comments Component -->
      <Comments :comments="result.post.comments" />
    </div>
  </div>
</template>

<style scoped>
.post-detail {
  max-width: 800px;
  margin: 0 auto;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.loading,
.error,
.not-found {
  padding: 2rem;
}

.post h1 {
  font-size: 2.5rem;
}

.post {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.meta {
  color: #666;
}

.body {
  line-height: 1.6;
  font-size: 1.1rem;
}

.back-link {
  text-decoration: none;
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #333;
}

.back-link:hover {
  text-decoration: underline;
}
</style>
