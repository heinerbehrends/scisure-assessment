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
      <span>
        <button type="submit" class="margin-right">Search</button>
        <button v-if="props.searchQuery" type="button" @click="handleReset">
          Reset
        </button>
      </span>
    </div>
  </form>
</template>

<style>
.search-form {
  text-align: left;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
  width: 100%;
}

.margin-right {
  margin-right: 1rem;
}

.search-input {
  flex-grow: 1;
}
</style>
