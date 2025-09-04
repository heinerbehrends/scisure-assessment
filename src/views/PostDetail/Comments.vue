<script setup lang="ts">
import { ref } from "vue";

type Comment = {
  id: string;
  name: string;
  body: string;
};

type CommentsData = {
  data: Comment[];
};

type Props = {
  comments: CommentsData;
};

const props = defineProps<Props>();
const showComments = ref(false);
</script>

<template>
  <div class="comments-section">
    <!-- Show Comments Button -->
    <button
      v-if="props.comments.data.length > 0"
      @click="showComments = !showComments"
    >
      {{
        showComments
          ? "Hide Comments"
          : `Show ${props.comments.data.length} Comments`
      }}
    </button>

    <!-- Comments -->
    <div v-if="showComments" class="comments">
      <h3>Comments</h3>
      <ul class="comments-list">
        <li v-for="comment in props.comments.data" :key="comment.id">
          <p class="comment-name">{{ comment.name }} writes:</p>
          <p>{{ comment.body }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.comments-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.comments {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 0 1rem;
}

.comment-name {
  font-style: italic;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  list-style: none;
  padding: 0;
}
</style>
