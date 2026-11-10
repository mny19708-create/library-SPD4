<template>
  <footer class="app-footer">
    <p>&copy; {{ currentYear }} Ebook Platform Admin Portal. All Rights Reserved.</p>
  </footer>
</template>

<script setup>
import { ref } from 'vue'
const currentYear = ref(new Date().getFullYear())
</script>

<style scoped>
.app-footer {
  text-align: center;
  padding: 15px;
  background-color: #ecf0f1;
  color: #7f8c8d;
  position: fixed;
  bottom: 0;
  width: 100%;
}
</style>