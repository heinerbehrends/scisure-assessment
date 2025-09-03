<script setup lang="ts">
// Router will handle the component rendering
</script>

<template>
  <main class="main">
    <router-view />
  </main>
</template>

<style>
.main {
  max-width: 960px;
  margin: 0 auto;
  padding: 1rem;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
