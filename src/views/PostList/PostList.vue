<script setup lang="ts">
import PostCreate from "./PostCreate/PostCreate.vue";
import SearchForm from "./SearchForm.vue";
import Pagination from "./Pagination.vue";
import { ref } from "vue";
import { usePostsQuery } from "./usePostsQuery";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const currentPage = ref(Number(route.query.page) || 1);
const pageSize = 10;
const searchParam = ref(route.query.search as string);
const router = useRouter();

const {
  searchQuery,
  loadSearch,
  handleReset,
  result,
  loading,
  error,
  loadPage,
  postListTop,
} = usePostsQuery({
  currentPage,
  pageSize,
  searchParam,
});

function resetPage() {
  handleReset();
  router.replace({ query: {} });
}

const showCreatePost = ref(false);
</script>

<template>
  <div class="post-list">
    <!-- Loading -->
    <div aria-busy="true" v-if="loading">Loading...</div>
    <!-- Error -->
    <div aria-live="assertive" v-if="error">Error: {{ error.message }}</div>
    <template v-if="result && result.posts.data">
      <h1>Posts</h1>
      <!-- Post Create -->
      <button @click="showCreatePost = !showCreatePost">
        {{ showCreatePost ? "- Close Create Post" : "+ Create Post" }}
      </button>
      <template v-if="showCreatePost">
        <PostCreate />
      </template>
      <!-- Search Form -->
      <template v-if="!showCreatePost">
        <SearchForm
          v-model:searchQuery="searchQuery"
          @search="loadSearch"
          @reset="resetPage"
        />
      </template>
      <!-- Post List -->
      <ul ref="postListTop">
        <p v-if="result.posts.data.length === 0">No posts found</p>
        <li v-for="post in result.posts.data" :key="post.id" class="post-item">
          <router-link
            :to="{
              name: 'PostDetail',
              params: { id: post.id },
              query: {
                page: currentPage,
                search: searchQuery ? searchQuery : undefined,
              },
            }"
            class="post-link"
          >
            <p>Read this post by {{ post.user.username }}</p>
            <h2>{{ post.title }}</h2>
          </router-link>
        </li>
      </ul>
      <!-- Pagination -->
      <Pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :result="result"
        :loading="loading"
        @load-page="loadPage"
      />
    </template>
  </div>
</template>

<style>
.post-item {
  padding: 2rem;
  padding-left: 0;
  border-bottom: 1px solid #ccc;
  text-align: left;
}

.post-link {
  height: 100% !important;
  width: 100% !important;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.post-link:hover {
  text-decoration: underline;
}

.post-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
</style>
