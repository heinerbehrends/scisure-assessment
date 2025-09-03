<script setup lang="ts">
import { useQuery } from "@vue/apollo-composable";
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import {
  type PostQueryResponse,
  type PostQueryArgs,
  GET_POST,
} from "./detail-types-queries";

const route = useRoute();
const postId = computed(() => route.params.id as string);
const showComments = ref(false);

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
    <router-link to="/" class="back-link">← Back to Posts</router-link>
    <!-- Loading -->
    <div v-if="loading" class="loading">Loading post...</div>
    <!-- Error -->
    <div v-if="error" class="error">{{ error }}</div>
    <!-- Post -->
    <div v-if="result && result.post" class="post">
      <h1>{{ result.post.title }}</h1>
      <p class="meta">By {{ result.post.user?.username }}</p>
      <div class="body">{{ result.post.body }}</div>
      <!-- Show Comments -->
      <button
        v-if="result && result.post.comments.data.length > 0"
        @click="showComments = !showComments"
        class="show-comments-btn"
      >
        {{ showComments ? "Hide Comments" : "Show Comments" }}
      </button>
      <!-- Comments -->
      <div v-if="showComments" class="comments">
        <h3>Comments</h3>
        <ul>
          <li v-for="comment in result.post.comments.data" :key="comment.id">
            <p class="comment-name">{{ comment.name }} writes:</p>
            <p>{{ comment.body }}</p>
          </li>
        </ul>
      </div>
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
  color: #42b883;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border: 1px solid #42b883;
  border-radius: 4px;
}

.back-link:hover {
  text-decoration: underline;
}

.comments {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1.5rem 1rem;
}

.show-comments-btn {
  padding: 0.5rem 1rem;
  font-size: 1rem;
}

.comment-name {
  font-style: italic;
}
</style>
