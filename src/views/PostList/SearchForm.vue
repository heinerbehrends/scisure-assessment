<script setup lang="ts">
type Props = {
  searchQuery: string;
};

type Emits = {
  (e: "update:searchQuery", value: string): void;
  (e: "search"): void;
  (e: "reset"): void;
};

const emit = defineEmits<Emits>();
const props = defineProps<Props>();
function handleSearch() {
  emit("search");
}

function handleReset() {
  emit("reset");
}

function updateSearchQuery(value: string) {
  emit("update:searchQuery", value);
}
</script>

<template>
  <form @submit.prevent="handleSearch" class="search-form">
    <div class="search-form">
      <label for="searchQuery" class="visually-hidden"> Search posts </label>
      <input
        :value="props.searchQuery"
        @input="updateSearchQuery(($event.target as HTMLInputElement).value)"
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
</template>

<style scoped>
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
</style>
