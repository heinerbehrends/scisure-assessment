<script setup lang="ts">
import { computed } from "vue";
import { getTotalCount, checkNextPage, checkPreviousPage } from "./pagination";
import type { PostListResponse } from "./list-types-queries";

interface PaginationProps {
  currentPage: number;
  pageSize: number;
  result: PostListResponse;
  loading: boolean;
}

interface PaginationEmits {
  (e: "loadPage", direction: "previous" | "next"): void;
}

const props = defineProps<PaginationProps>();
const emit = defineEmits<PaginationEmits>();

const totalCount = computed(() => {
  return getTotalCount(props.result);
});

const hasNextPage = computed(() => {
  if (!totalCount.value) return false;
  return checkNextPage({
    totalCount: totalCount.value,
    currentPage: props.currentPage,
    pageSize: props.pageSize,
  });
});

const hasPreviousPage = computed(() => {
  if (!props.currentPage) return false;
  return checkPreviousPage({
    currentPage: props.currentPage,
  });
});

function handleLoadPage(direction: "previous" | "next") {
  emit("loadPage", direction);
}
</script>

<template>
  <div class="pagination-controls">
    <!-- Load Previous Page Button -->
    <button
      id="previous-button"
      v-if="hasPreviousPage"
      @click="handleLoadPage('previous')"
      :disabled="loading"
    >
      Previous page
    </button>
    <!-- Load Next Page Button -->
    <button
      id="next-button"
      v-if="hasNextPage"
      @click="handleLoadPage('next')"
      :disabled="loading"
    >
      Next page
    </button>
  </div>
  <!-- Pagination Info -->
  <div v-if="totalCount !== null" class="pagination-info">
    <p>
      Page {{ currentPage }} of {{ Math.ceil(totalCount / pageSize) }} ({{
        result.posts.data.length
      }}
      of {{ totalCount }} posts)
    </p>
  </div>
</template>

<style scoped>
.pagination-controls {
  margin: 2rem 0;
  text-align: center;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.pagination-controls:has(#previous-button) {
  justify-content: space-between;
}

.pagination-info {
  text-align: center;
  color: #6c757d;
  margin-top: 1rem;
}
</style>
