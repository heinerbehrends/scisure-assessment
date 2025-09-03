<script setup lang="ts">
import PostCreate from "./PostCreate.vue";
import { ref, computed } from "vue";
import { getTotalCount, checkNextPage, checkPreviousPage } from "./pagination";
import { usePostsQuery } from "./usePostsQuery";

const currentPage = ref(1);
const pageSize = 10;

const {
  searchQuery,
  buildSearchOptions,
  result,
  loading,
  error,
  refetch,
  loadPage,
  postListTop,
} = usePostsQuery({
  currentPage,
  pageSize,
});

function loadSearch() {
  currentPage.value = 1; // Reset to first page when searching
  refetch({
    options: buildSearchOptions(1, pageSize),
  });
}

function handleReset() {
  searchQuery.value = "";
  currentPage.value = 1;
  showCreatePost.value = false;
  refetch({
    options: buildSearchOptions(1, pageSize),
  });
}

const totalCount = computed(() => {
  return getTotalCount(result.value);
});

const hasNextPage = computed(() => {
  if (!totalCount.value) return false;
  return checkNextPage({
    totalCount: totalCount.value,
    currentPage: currentPage.value,
    pageSize: pageSize,
  });
});

const hasPreviousPage = computed(() => {
  if (!currentPage.value) return false;
  return checkPreviousPage({
    currentPage: currentPage.value,
  });
});

const showCreatePost = ref(false);
</script>

<template>
  <div class="post-list">
    <!-- Loading -->
    <div aria-busy="true" v-if="loading">Loading...</div>
    <!-- Error -->
    <div aria-live="assertive" v-if="error">Error: {{ error.message }}</div>
    <!-- Post List -->
    <template v-if="result && result.posts.data">
      <h1>Posts</h1>
      <!-- Post Create -->
      <button
        v-if="!showCreatePost"
        @click="showCreatePost = !showCreatePost"
        class="search-button"
      >
        + Create Post
      </button>
      <template v-if="showCreatePost">
        <PostCreate />
      </template>
      <!-- Search Form -->
      <form @submit.prevent="loadSearch" class="search-form">
        <div class="search-form">
          <label for="searchQuery" class="visually-hidden">
            Search posts
          </label>
          <input
            v-model="searchQuery"
            id="searchQuery"
            type="text"
            placeholder="Search posts"
            class="search-input"
          />
          <button type="submit" class="search-button">Search</button>
          <button type="button" @click="handleReset" class="search-button">
            Reset
          </button>
        </div>
      </form>
      <!-- Post List -->
      <ul ref="postListTop">
        <li v-for="post in result.posts.data" :key="post.id" class="post-item">
          <router-link
            :to="{ name: 'PostDetail', params: { id: post.id } }"
            class="post-link"
          >
            <p>Read this post written by {{ post.user.username }}</p>
            <h2>{{ post.title }}</h2>
          </router-link>
        </li>
      </ul>
      <div class="pagination-controls">
        <!-- Load Previous Page Button -->
        <button
          v-if="hasPreviousPage"
          @click="loadPage('previous')"
          :disabled="loading"
          class="load-more-btn"
        >
          Load previous page
        </button>
        <!-- Load Next Page Button -->
        <button
          v-if="hasNextPage"
          @click="loadPage('next')"
          :disabled="loading"
          class="load-more-btn"
        >
          Load next page
        </button>
      </div>
      <!-- Pagination Info -->
      <div v-if="totalCount" class="pagination-info">
        <p>
          Page {{ currentPage }} of {{ Math.ceil(totalCount / pageSize) }} ({{
            result.posts.data.length
          }}
          of {{ totalCount }} posts)
        </p>
      </div>
    </template>
  </div>
</template>

<style>
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  list-style: none;
  padding: 0;
  margin: 0;
}

a {
  color: inherit;

  :hover {
    cursor: pointer;
    color: initial;
  }
}

.search-form {
  text-align: left;
  display: flex;
  gap: 1rem;
}

.search-input {
  padding: 0.75rem 1.5rem;
  border: 1px solid #888;
  border-radius: 4px;
  font-size: 1rem;
}

.search-button {
  padding: 0.75rem 1.5rem;
  background-color: #333;
  color: white;
  border: 1px solid #888;
  font-size: 1rem;
}

.search-input:focus {
  outline: none;
  border-color: #ccc;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  border: 0;
  white-space: nowrap;
}

.pagination-controls {
  margin: 2rem 0;
  text-align: center;
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.load-more-btn {
  padding: 0.75rem 1.5rem;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.load-more-btn:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.pagination-info {
  text-align: center;
  color: #6c757d;
  margin-top: 1rem;
}

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
