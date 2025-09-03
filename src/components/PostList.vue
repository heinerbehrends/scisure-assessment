<script setup lang="ts">
import { useQuery } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { ref, computed } from "vue";

type Post = {
  title: string;
  id: string;
  user: {
    username: string;
  };
  body: string;
};

type PostsData = {
  data: Post[];
  meta: {
    totalCount: number;
  };
};

type PostListResponse = {
  posts: PostsData;
};

type PageQueryOptions = {
  options: {
    paginate: {
      page: number;
      limit: number;
    };
    search: {
      q: string;
    };
  };
};
const POSTS = gql`
  query GetPosts($options: PageQueryOptions) {
    posts(options: $options) {
      data {
        title
        id
        user {
          username
        }
        body
      }
      meta {
        totalCount
      }
    }
  }
`;

const currentPage = ref(1);
const pageSize = ref(10);
const searchQuery = ref("");

const { result, loading, error, fetchMore, refetch } = useQuery<
  PostListResponse,
  PageQueryOptions
>(POSTS, {
  options: {
    paginate: {
      page: currentPage.value,
      limit: 10,
    },
    search: {
      q: searchQuery.value,
    },
  },
});
console.log("result", result.value);

// Load next page function
type LoadPageArgs = "next" | "previous";

function loadPage(type: LoadPageArgs) {
  if (!result.value?.posts.data) return;

  const newPage =
    type === "next" ? currentPage.value + 1 : currentPage.value - 1;

  currentPage.value = newPage;

  fetchMore({
    variables: {
      options: {
        paginate: {
          page: currentPage.value,
          limit: pageSize.value,
        },
        search: {
          q: searchQuery.value,
        },
      },
    },
    updateQuery: (previousResult: PostListResponse, { fetchMoreResult }) => {
      if (!fetchMoreResult) return previousResult;
      return {
        posts: {
          ...previousResult.posts,
          data: fetchMoreResult.posts.data,
          meta: fetchMoreResult.posts.meta,
        },
      };
    },
  });
}

function loadSearch() {
  refetch({
    options: {
      paginate: { page: 1, limit: 10 },
      search: { q: searchQuery.value },
    },
  });
}

const totalCount = computed(() => {
  if (!result.value?.posts?.meta) return null;
  const { meta } = result.value.posts;
  console.log(meta);
  return meta.totalCount;
});

type CheckNextPageArgs = {
  totalCount: number;
  currentPage: number;
  pageSize: number;
};

function checkNextPage({
  totalCount,
  currentPage,
  pageSize,
}: CheckNextPageArgs) {
  return totalCount > currentPage * pageSize;
}

type CheckPreviousPageArgs = {
  currentPage: number;
};

function checkPreviousPage({ currentPage }: CheckPreviousPageArgs) {
  return currentPage > 1;
}

const hasNextPage = computed(() => {
  if (!totalCount.value) return false;
  return checkNextPage({
    totalCount: totalCount.value,
    currentPage: currentPage.value,
    pageSize: pageSize.value,
  });
});

const hasPreviousPage = computed(() => {
  if (!currentPage.value) return false;
  return checkPreviousPage({
    currentPage: currentPage.value,
  });
});
</script>

<template>
  <div aria-busy="true" v-if="loading">Loading...</div>
  <div aria-live="assertive" v-if="error">Error: {{ error.message }}</div>
  <form @submit.prevent="loadSearch" class="search-form">
    <label for="searchQuery" class="visually-hidden">Search posts</label>
    <input
      v-model="searchQuery"
      id="searchQuery"
      type="text"
      placeholder="Search posts"
      class="search-input"
    />
    <button type="submit">Search</button>
  </form>
  <section v-if="result && result.posts.data">
    <!-- Post List -->
    <h1>Posts</h1>
    <ul>
      <li v-for="post in result.posts.data" :key="post.id" class="post-item">
        <h2>{{ post.title }}</h2>
        <p>{{ post.body }}</p>
        <p>Written by {{ post.user.username }}</p>
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
        {{ loading ? "Loading..." : "Load previous page" }}
      </button>
      <!-- Load Next Page Button -->
      <button
        v-if="hasNextPage"
        @click="loadPage('next')"
        :disabled="loading"
        class="load-more-btn"
      >
        {{ loading ? "Loading..." : "Load next page" }}
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
  </section>
</template>

<style>
.search-form {
  margin: 2rem 0;
  text-align: center;
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.search-input {
  padding: 0.75rem 1.5rem;
  border: 1px solid #888;
  border-radius: 4px;
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
  background-color: #007bff;
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

.load-more-btn:hover:not(:disabled) {
  background-color: #0056b3;
}

.pagination-info {
  text-align: center;
  color: #6c757d;
  margin-top: 1rem;
}

.post-item {
  list-style: none;
  padding: 1rem;
  border-bottom: 1px solid #ccc;
  text-align: left;
}
</style>
